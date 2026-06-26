/**
 * Endpoint dati generico su D1 — ponte tra il frontend e il database.
 *
 * Riceve una "query spec" strutturata (prodotta dal client shim in
 * src/integrations/api/db.ts) e la traduce in SQL parametrizzato, con allowlist
 * rigorosa di tabelle e colonne. Sostituisce l'accesso diretto che prima il
 * browser faceva verso Supabase/PostgREST.
 *
 * Autorizzazione: la LETTURA (select) è pubblica — la dashboard è un launcher
 * visibile a chiunque. Le SCRITTURE (insert/update/delete) richiedono la
 * sessione admin (cookie firmato, verificato dal middleware in context.data).
 */
import type { AuthData } from "./_middleware";

interface Env {
  DB: D1Database;
}

// Schema noto: colonne ammesse per tabella. Qualsiasi colonna non elencata
// viene rifiutata, sia in lettura che in scrittura.
const SCHEMA: Record<string, string[]> = {
  folders: ["id", "name", "color", "position", "created_at"],
  apps: ["id", "name", "icon_name", "href", "color", "position", "folder_id", "position_in_folder", "created_at"],
};

const FILTER_OPS: Record<string, string> = {
  eq: "=",
  neq: "!=",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
};

interface Filter {
  column: string;
  op: keyof typeof FILTER_OPS;
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
  filters?: Filter[];
  order?: { column: string; ascending: boolean }[];
  limit?: number;
  single?: boolean;
  returning?: boolean;
}

class BadRequest extends Error {}
class Forbidden extends Error {}

function assertTable(table: string): string[] {
  const cols = SCHEMA[table];
  if (!cols) throw new BadRequest(`Tabella non ammessa: ${table}`);
  return cols;
}

function assertColumn(table: string, column: string) {
  if (!SCHEMA[table].includes(column)) {
    throw new BadRequest(`Colonna non ammessa: ${table}.${column}`);
  }
}

function buildWhere(table: string, filters: Filter[] | undefined, params: unknown[]): string {
  if (!filters || filters.length === 0) return "";
  const clauses = filters.map((f) => {
    assertColumn(table, f.column);
    const sqlOp = FILTER_OPS[f.op];
    if (!sqlOp) throw new BadRequest(`Operatore filtro non ammesso: ${f.op}`);
    params.push(f.value);
    return `"${f.column}" ${sqlOp} ?`;
  });
  return " WHERE " + clauses.join(" AND ");
}

function buildOrder(table: string, order: QuerySpec["order"]): string {
  if (!order || order.length === 0) return "";
  const parts = order.map((o) => {
    assertColumn(table, o.column);
    return `"${o.column}" ${o.ascending ? "ASC" : "DESC"}`;
  });
  return " ORDER BY " + parts.join(", ");
}

async function handleSelect(env: Env, spec: QuerySpec) {
  assertTable(spec.table);
  const params: unknown[] = [];

  if (spec.count && spec.head) {
    const where = buildWhere(spec.table, spec.filters, params);
    const sql = `SELECT COUNT(*) AS c FROM "${spec.table}"${where}`;
    const res = await env.DB.prepare(sql).bind(...params).first<{ c: number }>();
    return { data: null, count: res?.c ?? 0, error: null };
  }

  const requested = (spec.columns ?? "*").trim();
  const useStar = requested === "" || requested === "*";
  const cols = useStar
    ? "*"
    : requested.split(",").map((c) => { const t = c.trim(); assertColumn(spec.table, t); return `"${t}"`; }).join(", ");

  const where = buildWhere(spec.table, spec.filters, params);
  const order = buildOrder(spec.table, spec.order);
  const limit = spec.single ? " LIMIT 1" : spec.limit ? ` LIMIT ${Number(spec.limit)}` : "";
  const sql = `SELECT ${cols} FROM "${spec.table}"${where}${order}${limit}`;

  const res = await env.DB.prepare(sql).bind(...params).all();
  const rows = res.results as Record<string, unknown>[];

  let count: number | null = null;
  if (spec.count) {
    const cParams: unknown[] = [];
    const cWhere = buildWhere(spec.table, spec.filters, cParams);
    const cRes = await env.DB.prepare(`SELECT COUNT(*) AS c FROM "${spec.table}"${cWhere}`).bind(...cParams).first<{ c: number }>();
    count = cRes?.c ?? 0;
  }

  if (spec.single) return { data: rows[0] ?? null, count, error: null };
  return { data: rows, count, error: null };
}

async function handleInsert(env: Env, spec: QuerySpec) {
  assertTable(spec.table);
  const rowsIn = Array.isArray(spec.values) ? spec.values : [spec.values ?? {}];
  if (rowsIn.length === 0) throw new BadRequest("insert senza valori");

  const colSet = new Set<string>();
  for (const r of rowsIn) for (const k of Object.keys(r)) { assertColumn(spec.table, k); colSet.add(k); }
  const cols = [...colSet];

  const inserted: Record<string, unknown>[] = [];
  for (const r of rowsIn) {
    const params = cols.map((c) => r[c] ?? null);
    const placeholders = cols.map(() => "?").join(", ");
    const colSql = cols.map((c) => `"${c}"`).join(", ");
    const ret = spec.returning ? " RETURNING *" : "";
    const sql = `INSERT INTO "${spec.table}" (${colSql}) VALUES (${placeholders})${ret}`;
    const stmt = env.DB.prepare(sql).bind(...params);
    if (spec.returning) {
      const res = await stmt.all();
      for (const row of res.results as Record<string, unknown>[]) inserted.push(row);
    } else {
      await stmt.run();
    }
  }

  if (spec.returning) return { data: spec.single ? inserted[0] ?? null : inserted, count: null, error: null };
  return { data: null, count: null, error: null };
}

async function handleUpdate(env: Env, spec: QuerySpec) {
  assertTable(spec.table);
  if (!spec.set || Object.keys(spec.set).length === 0) throw new BadRequest("update senza campi");

  const setCols = Object.keys(spec.set);
  for (const c of setCols) assertColumn(spec.table, c);
  const params: unknown[] = setCols.map((c) => spec.set![c] ?? null);
  const setSql = setCols.map((c) => `"${c}" = ?`).join(", ");
  const where = buildWhere(spec.table, spec.filters, params);
  const ret = spec.returning ? " RETURNING *" : "";
  const sql = `UPDATE "${spec.table}" SET ${setSql}${where}${ret}`;

  const stmt = env.DB.prepare(sql).bind(...params);
  if (spec.returning) {
    const res = await stmt.all();
    const rows = res.results as Record<string, unknown>[];
    return { data: spec.single ? rows[0] ?? null : rows, count: null, error: null };
  }
  await stmt.run();
  return { data: null, count: null, error: null };
}

async function handleDelete(env: Env, spec: QuerySpec) {
  assertTable(spec.table);
  const params: unknown[] = [];
  const where = buildWhere(spec.table, spec.filters, params);
  if (!where) throw new BadRequest("delete senza filtri non consentito");
  const sql = `DELETE FROM "${spec.table}"${where}`;
  await env.DB.prepare(sql).bind(...params).run();
  return { data: null, count: null, error: null };
}

export const onRequestPost: PagesFunction<Env, string, AuthData> = async (context) => {
  try {
    const spec = (await context.request.json()) as QuerySpec;

    // Le scritture richiedono la sessione admin.
    if (spec.action !== "select" && !context.data.isAdmin) {
      throw new Forbidden("Operazione riservata all'amministratore");
    }

    let result;
    switch (spec.action) {
      case "select": result = await handleSelect(context.env, spec); break;
      case "insert": result = await handleInsert(context.env, spec); break;
      case "update": result = await handleUpdate(context.env, spec); break;
      case "delete": result = await handleDelete(context.env, spec); break;
      default: throw new BadRequest(`Azione non ammessa: ${(spec as QuerySpec).action}`);
    }
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto";
    const status = err instanceof Forbidden ? 403 : err instanceof BadRequest ? 400 : 500;
    return Response.json({ data: null, count: null, error: { message } }, { status });
  }
};
