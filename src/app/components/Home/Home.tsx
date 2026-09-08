"use client"
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Recipes from '../Recipes/Recipes';

export default function RecipeDashboard() {
  const [user, setUser] = useState({ firstName: "Jega" });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // دالة مساعدة لجلب اسم الوصفة بغض النظر عن اسم الخاصية (name أو title)
  const getItemName = (item: any) => item.name || item.title || item.strMeal || '';

  useEffect(() => {
    const query = searchTerm.trim();
    if (!query) {
      setSearchSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error('Recipe suggestions failed');

        const data = await response.json();
        setSearchSuggestions(data.meals ?? []);
      } catch (error) {
        if ((error as DOMException).name !== 'AbortError') {
          console.error('Recipe suggestions failed:', error);
          setSearchSuggestions([]);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchTerm]);

  const filteredItems = searchTerm.trim() === '' ? [] : searchSuggestions;

  // دالة عند الضغط على زر Search
  const handleSearchClick = async () => {
    const query = searchTerm.trim();
    if (!query || isSearching) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`,
      );
      if (!response.ok) throw new Error('Recipe search failed');

      const data = await response.json();
      const matchedMeal = data.meals?.[0];

      if (matchedMeal?.idMeal) {
        router.push(`/items/meal?mealId=${encodeURIComponent(matchedMeal.idMeal)}`);
      } else {
        alert("عذراً، هذه الوصفة غير موجودة");
      }
    } catch (error) {
      console.error('Recipe search failed:', error);
      alert("تعذر البحث عن الوصفة حالياً");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white  flex flex-col justify-between  relative">
      <div>
        {/* التحية وصورة البروفايل */}
        <div className="flex justify-between items-center p-4 mb-2">
          <div>
            <h1 className="template text-2xl font-bold text-gray-900">
              Hello {user.firstName || "Jega"}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              What are you cooking today?
            </p>
          </div>

          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-amber-100 border border-gray-100">
            <Image 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" 
              alt="Profile"
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        </div>

        {/* شريط البحث وزر الفلتر */}
        <div className="relative px-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 gap-3">
              <FaSearch className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search recipe" 
                className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
              />
            </div>

            <button 
              type="button"
              onClick={handleSearchClick}
              className="bg-[#129575] hover:bg-[#0f7a5f] transition-colors px-5 py-3.5 rounded-2xl flex items-center justify-center text-white shadow-sm text-sm font-medium cursor-pointer"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* قائمة النتائج المقترحة (Live Search Dropdown) */}
          {filteredItems.length > 0 && (
            <div className="absolute left-4 right-4 mt-2 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden z-50 max-h-60 overflow-y-auto">
              {filteredItems.map((item: any, index: number) => {
                const mealId = item.idMeal ?? item.mealId ?? item.id;
                const name = getItemName(item);
                return (
                  <div 
                    key={mealId ?? index}
                    onClick={() => {
                      router.replace(`/items/meal?mealId=${encodeURIComponent(String(mealId ?? ''))}`);
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
                );
              })}
            </div>
          )}
        </div>

        {/* Categories / Tabs */}
        <Recipes/>
      </div>
    </div>
  );
}