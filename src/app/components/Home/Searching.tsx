import { useRouter } from 'next/navigation';
import React from 'react'

export default function Searching({item, mealId, index, name}:any) {
    const navigate=useRouter();
  return (
   <>
     <div 
                    key={mealId ?? index}
                    onClick={() => {
                      navigate.replace(`/items/meal?mealId=${encodeURIComponent(String(mealId ?? ''))}`);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-none"
                  >
                    {(item.strMealThumb || item.image) && (
                      <img src={item.strMealThumb || item.image} alt={name} className="w-10 h-10 rounded-lg object-cover" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-800">{name}</p>
                      <p className="text-xs text-gray-400">{item.strCategory || item.category || 'Recipe'}</p>
                    </div>
                  </div>
   </>
  )
}
