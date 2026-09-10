'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiClock } from 'react-icons/fi';
import { recipe } from '@/utls/types/recipe';

export default function AddedPage() {
  const searchParams = useSearchParams();
  const recipeId = searchParams.get('id');
  const [addedRecipe, setAddedRecipe] = useState<recipe | null>(null);

  useEffect(() => {
    fetch('/api/recipes')
      .then((response) => response.ok ? response.json() : { recipes: [] })
      .then(({ recipes }: { recipes: recipe[] }) => {
        const selectedRecipe = recipeId
          ? recipes.find((item) => item.id === recipeId)
          : recipes[recipes.length - 1];
        setAddedRecipe(selectedRecipe || null);
      })
      .catch(() => setAddedRecipe(null));
  }, [recipeId]);

  if (!addedRecipe) {
    return (
      <main className="w-full max-w-md mx-auto min-h-screen bg-white p-4">
        <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-gray-600">
          <FiArrowLeft /> Back to profile
        </Link>
        <p className="mt-12 text-center text-sm text-gray-500">Recipe not found.</p>
      </main>
    );
  }

  return (
    <main className="w-full max-w-md mx-auto min-h-screen bg-white pb-10">
      <div className="relative h-64">
        <Image
          src={addedRecipe.image}
          alt={addedRecipe.name}
          fill
          className="object-cover"
          unoptimized
        />
        <Link
          href="/profile"
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-gray-700 shadow-sm"
          aria-label="Back to profile"
        >
          <FiArrowLeft />
        </Link>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{addedRecipe.name}</h1>
          <span className="flex shrink-0 items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-600">
            <FiClock /> {addedRecipe.time} min
          </span>
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-gray-900">Ingredients</h2>
          <ul className="mt-3 space-y-2">
            {addedRecipe.ingredients.map((ingredient, index) => (
              <li key={`${ingredient}-${index}`} className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {ingredient}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-gray-900">Cooking Steps</h2>
          <ol className="mt-3 space-y-2">
            {addedRecipe.steps.map((step, index) => (
              <li key={`${step}-${index}`} className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <span className="mr-2 font-semibold text-[#129575]">{index + 1}.</span>{step}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  )
}
