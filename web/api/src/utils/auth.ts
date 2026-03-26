import type { Context } from "hono";
import { getAdminDb } from "./instant-admin";

export async function verifyAuthToken(
  c: Context,
): Promise<
  { user: { id: string }; error: null } | { user: null; error: Response }
> {
  const token = c.req.header("authorization")?.replace("Bearer ", "") || null;

  if (!token) {
    return {
      user: null,
      error: c.json({ error: "Authentication required" }, 401),
    };
  }

  const adminDb = getAdminDb(c.env);
  const user = await adminDb.auth.verifyToken(token);

  if (!user) {
    return {
      user: null,
      error: c.json({ error: "Invalid or expired token" }, 401),
    };
  }

  return { user, error: null };
}
