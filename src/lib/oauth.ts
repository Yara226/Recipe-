import bcrypt from 'bcryptjs';
import { randomBytes, randomUUID } from 'node:crypto';
import { db } from './db';

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
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail) as
    | { id: number }
    | undefined;

  if (existingUser) return existingUser.id;

  const passwordHash = await bcrypt.hash(randomUUID(), 12);
  const result = db.prepare(
    'INSERT INTO users (first_name, email, password_hash) VALUES (?, ?, ?)',
  ).run(firstName.trim() || 'User', normalizedEmail, passwordHash);

  return Number(result.lastInsertRowid);
}
