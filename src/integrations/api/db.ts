/**
 * Client dati compatibile con il sottoinsieme dell'API Supabase usato dall'app.
 *
 * Espone `db.from(table)` che restituisce un query builder "thenable": le
 * chiamate concatenate (.select().eq().order().single() ecc.) accumulano una
 * spec che viene inviata in un'unica POST a /api/db, dove il Worker la traduce
 * in SQL su D1. La forma del risultato — `{ data, error, count }` — replica
 * quella di supabase-js, così i punti di chiamata esistenti restano invariati.
 */

const API_URL = "/api/db";

export interface PostgrestResponse<T = unknown> {
  data: T;
  error: { message: string } | null;
  count: number | null;
}

type FilterOp = "eq" | "neq" | "gt" | "gte" | "lt" | "lte";

interface Filter {
  column: string;
  op: FilterOp;
  value: unknown;
}

interface QuerySpec {
  table: string;
  action: "select" | "insert" | "update" | "delete";
  columns?: string;
  count?: boolean;
  head?: boolean;
  values?: Record<string, unknown> | Record<string, unknown>[];
  set?: Record<string, unknown>;
  filters: Filter[];
  order: { column: string; ascending: boolean }[];
  limit?: number;
  single?: boolean;
  returning?: boolean;
}

async function execute(spec: QuerySpec): Promise<PostgrestResponse<any>> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spec),
      credentials: "include",
    });
    const body = (await res.json()) as PostgrestResponse<unknown>;
    if (!res.ok && !body.error) {
      return { data: null, error: { message: `HTTP ${res.status}` }, count: null };
    }
    return body;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Errore di rete";
    return { data: null, error: { message }, count: null };
  }
}

/**
 * Query builder concatenabile. Implementa `then` per essere awaitabile come una
 * Promise (come fa supabase-js), inviando la richiesta al primo await.
 */
class QueryBuilder<T = any> implements PromiseLike<PostgrestResponse<T>> {
  private spec: QuerySpec;

  constructor(table: string) {
    this.spec = { table, action: "select", filters: [], order: [] };
  }

  select(columns?: string, opts?: { count?: "exact"; head?: boolean }): this {
    // .select() dopo insert/update significa "restituisci le righe".
    if (this.spec.action === "insert" || this.spec.action === "update") {
      this.spec.returning = true;
    } else {
      this.spec.action = "select";
    }
    if (columns && columns.trim() !== "") this.spec.columns = columns;
    if (opts?.count === "exact") this.spec.count = true;
    if (opts?.head) this.spec.head = true;
    return this;
  }

  insert(values: Record<string, unknown> | Record<string, unknown>[]): this {
    this.spec.action = "insert";
    this.spec.values = values;
    return this;
  }

  update(set: Record<string, unknown>): this {
    this.spec.action = "update";
    this.spec.set = set;
    return this;
  }

  delete(): this {
    this.spec.action = "delete";
    return this;
  }

  private addFilter(column: string, op: FilterOp, value: unknown): this {
    this.spec.filters.push({ column, op, value });
    return this;
  }

  eq(column: string, value: unknown): this { return this.addFilter(column, "eq", value); }
  neq(column: string, value: unknown): this { return this.addFilter(column, "neq", value); }
  gt(column: string, value: unknown): this { return this.addFilter(column, "gt", value); }
  gte(column: string, value: unknown): this { return this.addFilter(column, "gte", value); }
  lt(column: string, value: unknown): this { return this.addFilter(column, "lt", value); }
  lte(column: string, value: unknown): this { return this.addFilter(column, "lte", value); }

  order(column: string, opts?: { ascending?: boolean }): this {
    this.spec.order.push({ column, ascending: opts?.ascending !== false });
    return this;
  }

  limit(n: number): this {
    this.spec.limit = n;
    return this;
  }

  single(): this {
    this.spec.single = true;
    if (this.spec.action === "insert" || this.spec.action === "update") {
      this.spec.returning = true;
    }
    return this;
  }

  maybeSingle(): this {
    return this.single();
  }

  then<TResult1 = PostgrestResponse<T>, TResult2 = never>(
    onfulfilled?: ((value: PostgrestResponse<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return execute(this.spec).then(onfulfilled as never, onrejected);
  }
}

export const db = {
  from<T = any>(table: string): QueryBuilder<T> {
    return new QueryBuilder<T>(table);
  },
};
