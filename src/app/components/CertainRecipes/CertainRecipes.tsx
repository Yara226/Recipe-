'use client';
import  { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiGlobe, FiBookmark } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';


interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strArea?: string;
}

export default function CertainRecipes() {
    const navigate=useRouter()
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // 1. جلب إيميل المستخدم الحالي من جلسة الخادم
  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setUserEmail(data?.user?.email ?? null))
      .catch((error) => console.error('Error reading user:', error));
  }, []);

  // 2. تحميل الوصفات المحفوظة الخاصة بهذا المستخدم لتحديث حالة أزرار الحفظ
  useEffect(() => {
    if (!userEmail) return;
    fetch('/api/saved')
      .then((response) => response.json())
      .then(({ mealIds }: { mealIds: string[] }) => setSavedIds(mealIds))
      .catch((error) => console.error('Error loading saved recipes:', error));
  }, [userEmail]);

  // 3. جلب وصفات مميزة من الـ API لعرضها في القسم
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef');
        const data = await res.json();
        // نأخذ أول 6 وصفات كمثال
        if (data.meals) {
          setRecipes(data.meals.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // 4. دالة تبديل حالة الحفظ (حفظ / إزالة)
  const handleToggleSave = async (idMeal: string) => {
    if (!userEmail) {
      toast.error('يرجى تسجيل الدخول أولاً لحفظ الوصفات');
      return;
    }

    const isSaved = savedIds.includes(idMeal);
    const response = await fetch('/api/saved', {
      method: isSaved ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mealId: idMeal }),
    });

    if (!response.ok) {
      toast.error('تعذر تحديث الوصفة المحفوظة');
      return;
    }

    setSavedIds(isSaved ? savedIds.filter((id) => id !== idMeal) : [...savedIds, idMeal]);
    toast.success(isSaved ? 'تمت إزالة الوصفة من المحفوظات' : 'تم حفظ الوصفة بنجاح');
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">جاري تحميل الوصفات المميزة...</div>;
  }

  return (
    <section className="max-w-md  mx-auto px-4 my-10 flex flex-col justify-center relative">
      {/* عنوان القسم في منتصف الشاشة */}
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-wide">
          وصفات مميزة 
        </h2>
        <div className="w-16 h-1 bg-orange-500 rounded-full mt-2"></div>
        <p className="text-sm text-gray-500 mt-2">تشكيلة مختارة بعناية لأجمل وألذ الأطباق خصيصاً لكِ</p>
      </div>

      {/* شبكة عرض الوصفات */}
    {/* شبكة عرض الوصفات */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6  ">
  {Array.isArray(recipes) && recipes.map((recipe) => {
    const isSaved = savedIds.includes(recipe.idMeal);

    return (
      <div 
        key={recipe.idMeal} 
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative group transition-all hover:shadow-md"
      >
        {/* زر الحفظ */}
        <button
          onClick={() => handleToggleSave(recipe.idMeal)}
          aria-label="حفظ الوصفة"
          className="absolute top-3 left-3 p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm text-gray-600 hover:bg-gray-100 z-10 transition-colors"
        >
          <FiBookmark 
            className={`w-5 h-5 transition-colors ${
              isSaved ? 'text-red-500 fill-red-500' : 'text-gray-600'
            }`} 
          />
        </button>

        {/* صورة الوصفة */}
        <div className="relative w-full h-48">
          <Image
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            fill
            className="object-cover"
          />
        </div>

        {/* التفاصيل */}
        <div className="p-4 flex flex-col flex-1 justify-between">
          <div>
            <span className="bg-orange-50 text-orange-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Featured
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-2 line-clamp-1">
              {recipe.strMeal}
            </h3>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FiGlobe className="text-orange-500" />
              <span>{recipe.strArea || 'International'}</span>
            </div>
            
            <button
              onClick={() => navigate.push(`/items/meal?mealId=${recipe.idMeal}`)}
              className="text-orange-600 font-medium hover:underline text-xs"
            >
              عرض الوصفة &larr;
            </button>
          </div>
        </div>
      </div>
    );
  })}
</div>
    </section>
  );
}