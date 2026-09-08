"use client"
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import { fetchItems } from '../../../store/features/recipes/recipeSlice';
import Detailed from './Detailed';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
interface DetailedCategryProps {
  cateogry: string;
}

export default function DetailedCategry({ cateogry }: DetailedCategryProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.items);

  useEffect(() => {
    if (!cateogry) return;
    dispatch(fetchItems(cateogry));
  }, [dispatch, cateogry]);

  if (loading) return <p className="text-white text-center">جاري تحميل التصنيفات...</p>;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        
 <Link href={"/home"}>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">
          <FiArrowLeft className="w-5 h-5" />
        </button></Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((meal) => (
            <Detailed key={meal.idMeal} item={meal} />
          ))}
        </div>
      </div>
    </>
  );
}
