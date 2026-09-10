'use client';

import  { useState, useEffect } from 'react';
import Image from 'next/image';
import {  FiGlobe, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import {  FiArrowLeft } from 'react-icons/fi';
import { Meal } from '@/utls/types/meal'
import Link from 'next/link';
export default function SavedRecipes() {
  const navigate=useRouter()
  const [savedMeals, setSavedMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // 1. جلب المستخدم الحالي من جلسة الخادم
  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setUserEmail(data?.user?.email ?? null))
      .catch((error) => console.error('Error fetching user email:', error));
  }, []);

  // 2. جلب تفاصيل الوصفات المحفوظة من الـ API بناءً على الـ IDs المخزنة في الـ localStorage
  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    const fetchSavedMeals = async () => {
      setLoading(true);
      try {
        const savedResponse = await fetch('/api/saved');
        const { mealIds: storedIds }: { mealIds: string[] } = await savedResponse.json();

        if (storedIds.length === 0) {
          setSavedMeals([]);
          setLoading(false);
          return;
        }

        // جلب تفاصيل كل وصفة بالـ ID الخاص بها من الـ TheMealDB API
        const promises = storedIds.map(async (id) => {
          const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
          const data = await res.json();
          return data.meals ? data.meals[0] : null;
        });

        const results = await Promise.all(promises);
        setSavedMeals(results.filter((meal): meal is Meal => meal !== null));
      } catch (error) {
        console.error('Error fetching saved meals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedMeals();
  }, [userEmail]);

  // 3. دالة إزالة عنصر من المفضلة وحفظ التغيير
  const handleRemove = async (idMeal: string) => {
    if (!userEmail) return;

    await fetch('/api/saved', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mealId: idMeal }),
    });

    // تحديث الـ State فوراً لإخفاء الكارد من الصفحة
    setSavedMeals((prev) => prev.filter((meal) => meal.idMeal !== idMeal));
  };

  if (!userEmail) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-gray-600 text-lg">يرجى تسجيل الدخول لعرض الوصفات المحفوظة.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center">
        <p className="text-gray-500 animate-pulse">جاري تحميل الوصفات المحفوظة...</p>
      </div>
    );
  }

  return (

    <div className="max-w-6xl mx-auto p-6 my-8">
     <Link href={"/home"}>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors m-4">
                <FiArrowLeft className="w-5 h-5" />
              </button>
            </Link>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">الوصفات المحفوظة</h1>

      {savedMeals.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
          <p className="text-gray-500 text-lg">لا توجد وصفات محفوظة حالياً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {savedMeals.map((meal) => (
            <div key={meal.idMeal} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative group">
              {/* زر الحذف */}
              <button
                onClick={() => handleRemove(meal.idMeal)}
                title="إزالة من المحفوظات"
                className="absolute top-3 left-3 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-sm text-red-500 hover:bg-red-50 transition-colors z-10"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>

              {/* صورة الوصفة */}
              <div className="relative w-full h-48">
                <Image
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  fill
                  className="object-cover"
                />
              </div>

              {/* تفاصيل الوصفة */}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <span className="bg-orange-50 text-orange-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {meal.strCategory || 'Recipe'}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 mt-2 line-clamp-1">
                    {meal.strMeal}
                  </h2>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FiGlobe className="text-orange-500" />
                    <span>{meal.strArea || 'General'}</span>
                  </div>
                  
                  {/* زر الانتقال لصفحة التفاصيل */}
                  <button
                    onClick={() => navigate.push(`/items/meal?mealId=${meal.idMeal}`)}
                    className="text-orange-600 font-medium hover:underline text-xs"
                  >
                    عرض الوصفة &larr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}