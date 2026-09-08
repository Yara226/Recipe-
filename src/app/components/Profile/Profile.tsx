'use client';
import  { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMoreHorizontal, FiArrowLeft } from 'react-icons/fi';
import { recipe } from '@/utls/types/recipe';
import MyRecipe from './MyRecipe';
import SavedItems from './SavedItems';
import DropDown from './DropDown';
export default function ProfilePage() {
  const [user, setUser] = useState<{ firstName?: string; lastName?: string; email?: string }>({});
  const [activeTab, setActiveTab] = useState('My Recipe');
  // داتا الوصفات الخاصة بيوزر والوصفات المحفوظة
  const [myRecipes, setMyRecipes] = useState<recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  // 1. جلب بيانات المستخدم الحالي
  useEffect(() => {
    try {
      const persistRoot = localStorage.getItem('persist:root');
      if (persistRoot) {
        const parsedRoot = JSON.parse(persistRoot);
        if (parsedRoot.currentUser) {
          const userObj = JSON.parse(parsedRoot.currentUser);
          if (userObj) setUser(userObj);
          return;
        }
      }
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 2. جلب الـ myRecipes من الـ localStorage
  useEffect(() => {
    try {
      if (!user.email) {
        setMyRecipes([]);
        return;
      }

      const storedMyRecipes = localStorage.getItem("myRecipes");
      const allRecipes: recipe[] = JSON.parse(storedMyRecipes || "[]");
      setMyRecipes(allRecipes.filter((storedRecipe) => storedRecipe.email === user.email));
    } catch (e) {
      console.error("Error loading myRecipes:", e);
    }
  }, [user.email]);

  const handleDeleteMyRecipe = (id: string) => {
    const updatedRecipes = myRecipes.filter((recipe) => recipe.id !== id);
    setMyRecipes(updatedRecipes);

    const allRecipes: recipe[] = JSON.parse(localStorage.getItem("myRecipes") || "[]");
    localStorage.setItem(
      "myRecipes",
      JSON.stringify(allRecipes.filter((recipe) => recipe.email !== user.email || recipe.id !== id)),
    );
  };

  // 3. جلب الوصفات المحفوظة بناءً على إيميل اليوزر الحالي
  useEffect(() => {
    if (activeTab !== 'Saved Recipes' || !user?.email) return;

    const fetchSavedMeals = async () => {
      setLoadingSaved(true);
      try {
        const savedItemsKey = `saved_items_${user.email}`;
        const storedIds: string[] = JSON.parse(localStorage.getItem(savedItemsKey) || '[]');

        if (storedIds.length === 0) {
          setSavedRecipes([]);
          setLoadingSaved(false);
          return;
        }

        const promises = storedIds.map(async (id) => {
          const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
          const data = await res.json();
          return data.meals ? data.meals[0] : null;
        });

        const results = await Promise.all(promises);
        setSavedRecipes(results.filter((meal) => meal !== null));
      } catch (error) {
        console.error('Error fetching saved meals:', error);
      } finally {
        setLoadingSaved(false);
      }
    };

    fetchSavedMeals();
  }, [activeTab, user?.email]);

  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col justify-between relative pb-24">
      <div>
        <Link href={"/home"}>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors m-4">
            <FiArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        
        {/* Top Header */}
        <div className="flex justify-between items-center px-4 mb-2">
          <h1 className="text-lg font-bold text-gray-900">Profile</h1>
          <DropDown />
        </div>

        {/* Profile Info Header */}
        <div className="px-4 flex items-center gap-6 mb-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border border-gray-100 shadow-sm">
            <Image 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces" 
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex justify-around flex-1 text-center">
            <div>
              <span className="block  font-bold text-gray-900 text-3xl">{myRecipes.length}</span>
              <span className="text-xl text-gray-400">Recipe</span>
            </div>
           
          </div>
        </div>

        {/* Name & About Me */}
        <div className="px-4 mb-6">
          <h2 className="font-bold text-gray-900 text-base">
            {user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Yara H.Salem"}
          </h2>
        </div>

        {/* Tabs (My Recipe / Saved Recipes) */}
        <div className="flex gap-2 px-4 mb-6">
          {['My Recipe', 'Saved Recipes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all ${
                activeTab === tab
                  ? 'bg-[#129575] text-white shadow-sm'
                  : 'bg-gray-50 text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List Content Based on Active Tab */}
        <div className="px-4 space-y-4">
          {activeTab === 'My Recipe' ? (
            myRecipes.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">لم تقومي بإضافة أي وصفات بعد.</p>
            ) : (
              <MyRecipe recipes={myRecipes} onDelete={handleDeleteMyRecipe} />
            )
          ) : (
            // Saved Recipes Tab
            loadingSaved ? (
              <p className="text-center text-gray-400 text-sm py-8">جاري تحميل الوصفات المحفوظة...</p>
            ) : savedRecipes.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">لا توجد وصفات محفوظة حالياً.</p>
            ) : (
              savedRecipes.map((meal) => (
                <SavedItems key={meal.idMeal} meal={meal} />
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}