"use client"
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store'; // عدلي المسار لو لزم الأمر
import Recipes from '../Recipes/Recipes';

export default function RecipeDashboard() {
  const [user, setUser] = useState({ firstName: "Jega" });
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // جلب العناصر من الـ Redux
  const { items } = useSelector((state: RootState) => state.items);

  // عشان نتأكد من شكل البيانات واسم الحقول في الكونسول
  useEffect(() => {
    console.log("Redux Items:", items);
  }, [items]);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // دالة مساعدة لجلب اسم الوصفة بغض النظر عن اسم الخاصية (name أو title)
  const getItemName = (item: any) => item.name || item.title || item.strMeal || '';

  // تصفية العناصر أثناء الكتابة
  const filteredItems = searchTerm.trim() === '' ? [] : items.filter((item: any) => 
    getItemName(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // دالة عند الضغط على زر Search
  const handleSearchClick = () => {
    if (!searchTerm.trim()) return;
    
    const matchedItem = items.find((item: any) => 
      getItemName(item).toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchedItem) {
      const mealId = (matchedItem as any).idMeal ?? (matchedItem as any).mealId ?? (matchedItem as any).id;
      console.log("Navigating to mealId:", mealId);
      router.push(`/items/meal?mealId=${encodeURIComponent(String(mealId))}`);
    } else {
      alert("عذراً، هذه الوصفة غير موجودة");
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
              Search
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
                    {item.image && (
                      <img src={item.image} alt={name} className="w-10 h-10 rounded-lg object-cover" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-800">{name}</p>
                      <p className="text-xs text-gray-400">{item.category || 'Recipe'}</p>
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