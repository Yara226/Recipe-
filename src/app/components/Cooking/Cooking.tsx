"use client"

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import { fetchMeals } from '../../../store/features/meal/mealSlice';
import CookingCard from './CookingCard';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
export default function Cooking({ mealId }: { mealId: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { meals, loading } = useSelector((state: RootState) => state.meals);
 
  useEffect(() => {
    // بنعمل جلب للبيانات بناءً على الـ mealId لو متوفر
    if (mealId) {
      dispatch(fetchMeals(mealId));
    }
  }, [dispatch, mealId]);

  // تجهيز المصفوفة بأمان سواء كانت meals عبارة عن مصفوفة أو غلاف جواها
  const mealsList = Array.isArray(meals) 
    ? meals 
    : (meals as any)?.meals || [];

  if (loading) return <p className="text-gray-600 text-center py-8">جاري تحميل طرق التحضير...</p>;

  return (
    <div className="px-4 m-4">
       <Link href={"/home"}>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">
          <FiArrowLeft className="w-5 h-5" />
        </button></Link>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">طرق التحضير</h2>
      
      {Array.isArray(mealsList) && mealsList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mealsList.map((meal: any) => (
            <CookingCard key={meal.idMeal || meal.id || meal.mealId} meal={meal} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">لا توجد وجبات متاحة حالياً...</p>
      )}
    </div>
  );
}