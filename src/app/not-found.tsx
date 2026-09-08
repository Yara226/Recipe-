'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0b1d15] text-white flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full text-center">
                {/* أيقونة تعبر عن المطبخ أو الأكل */}
                <div className="text-7xl mb-5">🍲</div>
                
                <h1 className="text-3xl font-bold mb-3">
                    عفواً، الطبخة مش موجودة!
                </h1>
                
                <p className="text-gray-300 text-base mb-8 leading-relaxed">
                    البوصلة ضاعت منك، الصفحة دي شكلها اتحذفت أو الرابط مش مضبوط. رجّعك المطبخ تاني عشان تبدأ من جديد.
                </p>
                
                <Link 
                    href="/" 
                    className="inline-block w-full bg-[#129575] hover:bg-[#0f7d61] text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-[#129575]/30 transition duration-300 text-center"
                >
                    الرجوع للرئيسية
                </Link>
            </div>
        </div>
    );
}