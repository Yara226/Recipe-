'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiClock, FiGlobe, FiList } from 'react-icons/fi';

interface RecipeDetailsProps {
  meal: any;
}

export default function RecipeDetails({ meal }: RecipeDetailsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const itemId = meal.idMeal;

  // جلب إيميل المستخدم الحالي ديناميكياً عند تحميل الصفحة أو تغيير الحساب
  useEffect(() => {
    try {
      // 1. محاولة الجلب من Redux Persist لو مخزن بالطريقة القياسية
      const persistRoot = localStorage.getItem('persist:root');
      if (persistRoot) {
        const parsedRoot = JSON.parse(persistRoot);
        // أحياناً الـ currentUser بيكون مخزن جوا الـ persist كـ string JSON
        if (parsedRoot.currentUser) {
          const userObj = JSON.parse(parsedRoot.currentUser);
          if (userObj?.email) {
            setUserEmail(userObj.email);
            return;
          }
        }
      }

      // 2. كبديل: البحث المباشر لو كنت مخزن الـ currentUser لوحده في الـ localStorage
      const directUser = localStorage.getItem('currentUser');
      if (directUser) {
        const userObj = JSON.parse(directUser);
        if (userObj?.email) {
          setUserEmail(userObj.email);
        }
      }
    } catch (error) {
      console.error('Error fetching current user email:', error);
    }
  }, []);

  // التحقق هل الوصفة محفوظة لهذا المستخدم بالذات أم لا
  useEffect(() => {
    if (!userEmail) return;
    const savedItemsKey = `saved_items_${userEmail}`;
    const storedItems: string[] = JSON.parse(localStorage.getItem(savedItemsKey) || '[]');
    setIsSaved(storedItems.includes(itemId));
  }, [itemId, userEmail]);

  const handleToggleSave = () => {
    if (!userEmail) {
      alert('يرجى تسجيل الدخول أولاً لحفظ الوصفات');
      return;
    }

    const savedItemsKey = `saved_items_${userEmail}`;
    const storedItems: string[] = JSON.parse(localStorage.getItem(savedItemsKey) || '[]');

    let updatedItems: string[];
    if (isSaved) {
      updatedItems = storedItems.filter((id) => id !== itemId);
    } else {
      updatedItems = [...storedItems, itemId];
    }

    localStorage.setItem(savedItemsKey, JSON.stringify(updatedItems));
    setIsSaved(!isSaved);
  };

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : '',
      });
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100 my-8 relative">
      {/* زر الحفظ في الزاوية */}
      <button
        onClick={handleToggleSave}
        aria-label="حفظ الوصفة"
        className="absolute top-6 left-6 p-2.5 rounded-full bg-white/85 backdrop-blur-md shadow-sm border border-gray-100 transition-all hover:bg-gray-100 z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isSaved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2}
          className={`w-6 h-6 transition-colors ${
            isSaved ? 'text-red-500 fill-red-500' : 'text-gray-600'
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
          />
        </svg>
      </button>

      {/* رأس الصفحة: الصورة والاسم */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="relative w-full md:w-72 h-72 rounded-2xl overflow-hidden shadow-md shrink-0">
          <Image
            src={meal.strMealThumb}
            alt={meal.strMeal}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1">
          <span className="bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
            {meal.strCategory || 'Recipe'}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-4">
            {meal.strMeal}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FiGlobe className="text-orange-500" />
              <span>{meal.strArea || 'International'} Cuisine</span>
            </div>
            <div className="flex items-center gap-1">
              <FiClock className="text-orange-500" />
              <span>30 mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* قسم المكونات */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FiList className="text-orange-500" /> Ingredients
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl">
          {ingredients.map((item, index) => (
            <li key={index} className="flex justify-between text-sm py-1.5 px-3 bg-white rounded-lg border border-gray-100 shadow-2xs">
              <span className="font-medium text-gray-800">{item.ingredient}</span>
              <span className="text-gray-500">{item.measure}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* قسم خطوات التحضير */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions</h2>
        <div className="text-gray-700 leading-relaxed space-y-3 whitespace-pre-line bg-gray-50 p-6 rounded-xl">
          {meal.strInstructions}
        </div>
      </div>
    </div>
  );
}