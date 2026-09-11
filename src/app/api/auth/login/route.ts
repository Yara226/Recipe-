import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db, dbReady } from '@/lib/db';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  await dbReady;
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');
  const result = await db.execute({
    sql: 'SELECT id, password_hash FROM users WHERE email = ?',
    args: [email],
  });
  const user = result.rows[0] as unknown as
    | { id: number; password_hash: string }
    | undefined;

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
