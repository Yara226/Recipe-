import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';
import { db } from './db';

export type SessionUser = {
  id: number;
  firstName: string;
  email: string;
};

const sessionCookie = 'recipe_session';
const sessionDuration = 1000 * 60 * 60 * 24 * 30;

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return null;

  const row = db.prepare(`
    SELECT users.id, users.first_name AS firstName, users.email
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token = ? AND sessions.expires_at > ?
  `).get(token, Date.now()) as SessionUser | undefined;

  return row ?? null;
}

export async function createSession(userId: number) {
  const token = randomUUID();
  const expiresAt = Date.now() + sessionDuration;
  db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(token, userId, expiresAt);
  (await cookies()).set(sessionCookie, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiresAt),
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie)?.value;
  if (token) db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  cookieStore.delete(sessionCookie);
}
