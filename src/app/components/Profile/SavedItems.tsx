import { FaStar } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import Image from 'next/image';
import  {Meal} from '@/utls/types/meal';
export default function SavedItems({ meal }: { meal: Meal }) {
  return (
   <>
   <div key={meal.idMeal} className="relative rounded-2xl overflow-hidden h-44 shadow-md group">
                     <Image 
                       src={meal.strMealThumb} 
                       alt={meal.strMeal}
                       fill
                       className="object-cover group-hover:scale-105 transition-transform duration-300"
                     />
                     <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
   
                     <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1 text-xs font-semibold text-amber-700">
                       <FaStar className="w-3 h-3 text-amber-400" /> 4.0
                     </div>
   
                     <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                       <div>
                         <h3 className="font-bold text-sm leading-snug mb-1">{meal.strMeal}</h3>
                         <span className="text-[11px] text-gray-300">{meal.strArea || 'International'}</span>
                       </div>
                       <div className="flex items-center gap-1 text-xs text-gray-200 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-xs">
                         <FiClock className="w-3.5 h-3.5 text-orange-500" />
                         <span>30 min</span>
                       </div>
                     </div>
                   </div>
   </>
  )
}
