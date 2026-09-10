import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = db.prepare(`
    SELECT id, name, image, time, ingredients, steps
    FROM recipes WHERE user_id = ? ORDER BY created_at DESC
  `).all(user.id) as Array<{
    id: string;
    name: string;
    image: string;
    time: string;
    ingredients: string;
    steps: string;
  }>;

  return NextResponse.json({ recipes: rows.map((row) => ({
    ...row,
    email: user.email,
    ingredients: JSON.parse(row.ingredients),
    steps: JSON.parse(row.steps),
  })) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const id = String(body.id ?? '').trim();
  const name = String(body.name ?? '').trim();
  const image = String(body.image ?? '').trim();
  const time = String(body.time ?? '').trim();
  const ingredients = Array.isArray(body.ingredients) ? body.ingredients.filter(Boolean) : [];
  const steps = Array.isArray(body.steps) ? body.steps.filter(Boolean) : [];

  if (!id || !name || !image || !time) {
    return NextResponse.json({ error: 'Invalid recipe data' }, { status: 400 });
  }

  db.prepare(`
    INSERT INTO recipes (id, user_id, name, image, time, ingredients, steps)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, user.id, name, image, time, JSON.stringify(ingredients), JSON.stringify(steps));

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await request.json();
  db.prepare('DELETE FROM recipes WHERE id = ? AND user_id = ?').run(String(id), user.id);
  return NextResponse.json({ ok: true });
}
