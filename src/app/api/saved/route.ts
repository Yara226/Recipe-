import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db, dbReady } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbReady;
  const result = await db.execute({
    sql: 'SELECT meal_id FROM saved_recipes WHERE user_id = ? ORDER BY created_at DESC',
    args: [user.id],
  });
  const rows = result.rows as unknown as Array<{ meal_id: string }>;
  return NextResponse.json({ mealIds: rows.map((row) => row.meal_id) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { mealId } = await request.json();
  const normalizedMealId = String(mealId ?? '').trim();
  if (!normalizedMealId) return NextResponse.json({ error: 'Meal ID is required' }, { status: 400 });

  await dbReady;
  await db.execute({
    sql: 'INSERT OR IGNORE INTO saved_recipes (user_id, meal_id) VALUES (?, ?)',
    args: [user.id, normalizedMealId],
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { mealId } = await request.json();
  await dbReady;
  await db.execute({
    sql: 'DELETE FROM saved_recipes WHERE user_id = ? AND meal_id = ?',
    args: [user.id, String(mealId)],
  });
  return NextResponse.json({ ok: true });
}
