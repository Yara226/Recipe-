import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';
import { db, dbReady } from './db';

export type SessionUser = {
  id: number;
  firstName: string;
  email: string;
};

const sessionCookie = 'recipe_session';
const sessionDuration = 1000 * 60 * 60 * 24 * 30;

export async function getCurrentUser(): Promise<SessionUser | null> {
  await dbReady;
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return null;

  const result = await db.execute({
    sql: `
      SELECT users.id, users.first_name AS firstName, users.email
      FROM sessions
      JOIN users ON users.id = sessions.user_id
      WHERE sessions.token = ? AND sessions.expires_at > ?
    `,
    args: [token, Date.now()],
  });
  const row = result.rows[0] as unknown as SessionUser | undefined;

  return row ?? null;
}

export async function createSession(userId: number) {
  await dbReady;
  const token = randomUUID();
  const expiresAt = Date.now() + sessionDuration;
  await db.execute({
    sql: 'INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)',
    args: [token, userId, expiresAt],
  });
  (await cookies()).set(sessionCookie, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiresAt),
  });
}

export async function destroySession() {
  await dbReady;
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie)?.value;
  if (token) await db.execute({ sql: 'DELETE FROM sessions WHERE token = ?', args: [token] });
  cookieStore.delete(sessionCookie);
}
