"use client"

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RecipeCard from './RecipeCard';

import { fetchCategories } from  "../../../store/features/cateogries/categorySlice"
 export default function Resipes() {
 
  const dispatch = useDispatch();
    const { categories, loading } = useSelector((state: any) => state.category);
    useEffect(() => {
        dispatch(fetchCategories() as any);
    }, [dispatch]);

    if (loading) return <p className="text-white text-center">جاري تحميل التصنيفات...</p>;
   return (
    <><h1>Categries</h1>
         

        {/* Featured / Horizontal Scroll Recipes */}
        <div className="flex gap-4 overflow-x-auto px-4 mb-6 pt-8 no-scrollbar">
         
            
       
          {/* Card 2 */}
                {categories.map((item: any) => (
                    <RecipeCard 
                        key={item.idCategory} // مفتاح فريد لكل كارد
                        title={item.strCategory} // اسم التصنيف أو الوصفة
                        image={item.strCategoryThumb} // صورة التصنيف من الـ API
                        onBookmark={() => console.log(`Bookmarked: ${item.strCategory}`)}
                    />
                ))}
            </div>
       

    </>
   )
 }
 