
import Image from 'next/image';
import {  FiClock, FiTrash2 } from 'react-icons/fi';
import { recipe } from '@/utls/types/recipe';
import Link from 'next/link';
type MyRecipeProps = {
  recipes: recipe[];
  onDelete: (id: string) => void;
};

export default function MyRecipe({ recipes, onDelete }: MyRecipeProps) {

  return (
<div>
    {
                  recipes.map((recipe) => (
                   <Link key={recipe.id} href={`/added?id=${encodeURIComponent(recipe.id)}`} className="relative rounded-2xl overflow-hidden h-44 shadow-md group">
                    <div key={recipe.id} className="relative rounded-2xl overflow-hidden h-44 shadow-md group">
                      <Image 
                        src={recipe.image && recipe.image.startsWith('http') ? recipe.image : "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop"} 
                        alt={recipe.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
    
                      {/* زر حذف الوصفة الخاصة بي */}
                      <button
                        onClick={() => onDelete(recipe.id)}
                        className="absolute top-3 right-3 p-2 bg-white/80 rounded-full text-red-500 hover:bg-white shadow-md transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
    
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                        <div>
                          <h3 className="font-bold text-sm leading-snug mb-1">{recipe.name}</h3>
                          <span className="text-[11px] text-gray-300">By Yara</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-200 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-xs">
                          <FiClock className="w-3.5 h-3.5" />
                          <span>{recipe.time} min</span>
                        </div>
                      </div>
                    </div>
                   </Link>
                  ))
}
</div>
  )
}

