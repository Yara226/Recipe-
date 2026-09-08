'use client';
import { PiChefHat } from "react-icons/pi";
import { FaArrowRight } from "react-icons/fa";

import { useRouter } from 'next/navigation';
export default function HomePage() {
    const navigate=useRouter()
  return (
    <div style={{width:"100%" }}>
<div className="min-h-screen bg-cover bg-center text-white flex  flex-col justify-around font-sans relative"
 style={{ backgroundImage: `url('/Gemini_Generated_Image_l10egwl10egwl10e.jpeg')` }}>

  <div className="text-center flex flex-col items-center ">
    {/* أيقونة الشيف */}
    <PiChefHat className="text-9xl text-amber-50 mb-4" />
    
    {/* العنوان الرئيسي */}
    <h1 className="text-4xl text-center font-bold">
        100K+ Premium Recipe
    </h1>
</div>
<div className="text-center flex flex-col p-6 mt-2">
    <h1 className="text-4xl font-bold mb-1.5">Get <br/> Cooking</h1>
    <p className="mb-1.5">simple way to find tastey recipe</p>
    <button className="bg-emerald-700   p-3 text-center m-auto flex justify-center items-center " 
    onClick={()=>{
        navigate.replace('/signup')
    }}>Start <FaArrowRight className="ml-3 " />
</button>
</div>
 </div>

    </div>
  )
}
