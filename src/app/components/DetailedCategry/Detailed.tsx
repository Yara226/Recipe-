import React from 'react';
import { useRouter } from 'next/navigation';
interface RecipeCardProps {
  item: {
    strMeal: string;
    strMealThumb: string;
    idMeal: number;
    strCountry?: string; // خليناها اختياري عشان لو مش دايماً راجعة من الـ API
  };
}

export default function RecipeCard({ item }: RecipeCardProps) {
    const navigate=useRouter()
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* صورة الوجبة */}
      <div className="relative w-full h-48">
        <img
          src={item.strMealThumb}
          alt={item.strMeal}
          className="w-full h-full object-cover"
        />
      </div>

      {/* تفاصيل الوجبة */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <h3 className="text-lg font-bold text-gray-800 line-clamp-1 mb-2">
          {item.strMeal}
        </h3>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            {item.strCountry || 'General'}
          </span>
          <button onClick={() => navigate.push(`/items/meal?mealId=${item.idMeal}`)} className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors">
            View Recipe &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}