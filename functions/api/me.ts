/**
 * Sessione corrente. Restituisce l'utente admin se il cookie è valido,
 * altrimenti nessuna sessione. `isAdmin` è calcolato dal middleware.
 */
import type { AuthData } from "./_middleware";

export const onRequestGet: PagesFunction<Env, string, AuthData> = async (context) => {
  if (!context.data.isAdmin) {
    return Response.json({ data: null, error: null });
  }
  return Response.json({
    data: { user: { id: "admin", email: "admin" } },
    error: null,
  });
};
