import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = db.prepare('SELECT meal_id FROM saved_recipes WHERE user_id = ? ORDER BY created_at DESC').all(user.id) as Array<{ meal_id: string }>;
  return NextResponse.json({ mealIds: rows.map((row) => row.meal_id) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { mealId } = await request.json();
  const normalizedMealId = String(mealId ?? '').trim();
  if (!normalizedMealId) return NextResponse.json({ error: 'Meal ID is required' }, { status: 400 });

  db.prepare('INSERT OR IGNORE INTO saved_recipes (user_id, meal_id) VALUES (?, ?)').run(user.id, normalizedMealId);
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { mealId } = await request.json();
  db.prepare('DELETE FROM saved_recipes WHERE user_id = ? AND meal_id = ?').run(user.id, String(mealId));
  return NextResponse.json({ ok: true });
}
