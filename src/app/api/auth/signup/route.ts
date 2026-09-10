import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const firstName = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');

  if (!firstName || !email || password.length < 6) {
    return NextResponse.json({ error: 'Invalid signup data' }, { status: 400 });
  }

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existingUser) return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);
  const result = db.prepare(
    'INSERT INTO users (first_name, email, password_hash) VALUES (?, ?, ?)',
  ).run(firstName, email, passwordHash);

  await createSession(Number(result.lastInsertRowid));
  return NextResponse.json({ ok: true }, { status: 201 });
}
