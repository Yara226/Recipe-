'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { useForm, SubmitHandler } from "react-hook-form";
import type{Inputsin} from '../../../utls/types/sign'
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "../../../validations/validate";
import toast from "react-hot-toast";
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
export default function SignIn() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputsin>({
      resolver: zodResolver(signinSchema),
    });
const searchParams = useSearchParams();
useEffect(() => {
    const error = searchParams.get('error');
    try{
         toast.error(error || "حدث خطأ أثناء تسجيل الدخول");
    }
    catch (error) {
        console.error("Error displaying toast:", error);
    }
},[searchParams]);
        const onSubmit: SubmitHandler<Inputsin> = async (data) => {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
                return;
            }

            toast.success("تم تسجيل الدخول بنجاح");
            router.replace("/home");
        };

        const handleSocialLogin = (provider: 'google') => {
            try{
                window.location.assign(`/api/auth/${provider}`);
            }
          catch (error) {
            console.error("Social login failed:", error);
            toast.error("فشل تسجيل الدخول عبر وسائل التواصل الاجتماعي");
          }

        };
    return (
        <div 
            className="min-h-screen bg-cover bg-center text-white flex items-center justify-center p-4 font-sans relative"
            style={{ backgroundImage: "url('/food-bg.jpeg')" }}
        >
            {/* طبقة عتمة شفافة متناسقة مع ثيم التطبيق */}
            <div className="absolute inset-0 bg-[#0b1d15]/85 backdrop-blur-[2px]"></div>

            {/* صندوق الحاوية للـ Form */}
            <div className="relative z-10 max-w-md w-full bg-[#0b1d15]/90 p-8 rounded-3xl shadow-2xl border border-white/10">
                
                {/* العنوان الرئيسي */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Sign In</h1>
                    <p className="text-gray-300 text-sm">Welcome back! Please enter your details to sign in.</p>
                </div>

                {/* الفورم */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Email</label>
                        <input 
                            {...register("email")}
                            type="email" 
                            placeholder="Enter Email" 
                            className="w-full bg-transparent border border-gray-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#129575]"
                        />
                        {errors.email && (
                            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Password</label>
                        <input 
                            {...register("password")}
                            type="password" 
                            placeholder="Enter Password" 
                            className="w-full bg-transparent border border-gray-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#129575]"
                        />
                        {errors.password && (
                            <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* زر تسجيل الدخول */}
                    <button 
                        type="submit" 
                        className="w-full bg-[#129575] hover:bg-[#0f7d61] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-[#129575]/30 transition duration-300 mt-2"
                    >
                        Sign In
                    </button>
                </form>

                {/* فاصل (Or Sign in With) */}
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="px-3 text-gray-400 text-xs">Or Sign in With</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                {/* أزرار السوشيال ميديا */}
                <div className="flex justify-center gap-4 mb-6">
                    <button type="button" onClick={() => handleSocialLogin('google')} aria-label="Continue with Google" className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl border border-white/10 transition flex items-center justify-center w-16">
                        <FcGoogle className="text-2xl" />
                    </button>
                    
                </div>

                {/* زر الانتقال لصفحة الـ Sign Up لو مفيش حساب */}
                <div className="text-center text-sm text-gray-300">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-amber-400 font-semibold hover:underline">
                        Sign up
                    </Link>
                </div>

            </div>
        </div>
    );
}