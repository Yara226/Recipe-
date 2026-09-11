import { NextResponse } from 'next/server';
import { destroySession, getCurrentUser } from '@/lib/auth';
import { db, dbReady } from '@/lib/db';

export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbReady;
  await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [user.id] });
  await destroySession();
  return NextResponse.json({ ok: true });
}
