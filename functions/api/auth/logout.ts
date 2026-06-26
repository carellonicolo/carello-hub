/**
 * Logout admin: cancella il cookie di sessione.
 */
import { sessionCookieHeader } from "../_session";

export const onRequestPost: PagesFunction = async () => {
  return Response.json(
    { data: null, error: null },
    { headers: { "Set-Cookie": sessionCookieHeader(null) } },
  );
};
