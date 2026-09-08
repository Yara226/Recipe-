'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

// 1. تعريف أنواع البيانات اللي الكارد هياخدها
interface RecipeCardProps {
  title: string;
  image: string;
  rating?: number | string;
  onBookmark?: () => void;
}

export default function RecipeCard({ 
  title, 
  image, 
  rating = "3.5", 
  onBookmark 
}: RecipeCardProps) 
   

{
   const router = useRouter();
     const navigate=()=>{
         router.push(`/items?title=${encodeURIComponent(title)}`)
}
  return (
    <div className="min-w-[160px] max-w-[180px] bg-[#D9D9D9]/20 rounded-3xl p-3 pt-10 relative flex flex-col justify-between mt-10 shadow-sm" onClick={navigate}>
      
      {/* صورة الوصفة البارزة فوق الكارد */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full overflow-hidden shadow-md border-4 border-white bg-white">
        <Image 
          src={image} 
          alt={title}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>

     

      {/* اسم الوصفة */}
      <div className="text-center mt-6">
        <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">
          {title}
        </h3>
      </div>

      {/* زر الحفظ (Bookmark) */}
     

    </div>
  );
}