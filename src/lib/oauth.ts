import bcrypt from 'bcryptjs';
import { randomBytes, randomUUID } from 'node:crypto';
import { db, dbReady } from './db';

export type OAuthProvider = 'google' | 'facebook';

export function getAppUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export function getOAuthConfig(provider: OAuthProvider) {
  const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`];
  const clientSecret = process.env[`${provider.toUpperCase()}_CLIENT_SECRET`];

  if (!clientId || !clientSecret) {
    throw new Error(`${provider} OAuth environment variables are missing`);
  }

  return { clientId, clientSecret };
}

export function createOAuthState() {
  return randomBytes(24).toString('hex');
}

export async function findOrCreateOAuthUser(firstName: string, email: string) {
  await dbReady;
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = (await db.execute({
    sql: 'SELECT id FROM users WHERE email = ?',
    args: [normalizedEmail],
  })).rows[0] as unknown as
    | { id: number }
    | undefined;

  if (existingUser) return existingUser.id;

  const passwordHash = await bcrypt.hash(randomUUID(), 12);
  const result = await db.execute({
    sql: 'INSERT INTO users (first_name, email, password_hash) VALUES (?, ?, ?)',
    args: [firstName.trim() || 'User', normalizedEmail, passwordHash],
  });

  return Number(result.lastInsertRowid);
}
