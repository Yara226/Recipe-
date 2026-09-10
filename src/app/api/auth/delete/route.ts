import { NextResponse } from 'next/server';
import { destroySession, getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  db.prepare('DELETE FROM users WHERE id = ?').run(user.id);
  await destroySession();
  return NextResponse.json({ ok: true });
}
