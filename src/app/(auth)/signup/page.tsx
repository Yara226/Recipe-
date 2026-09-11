
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { useForm, SubmitHandler } from "react-hook-form"
import type {Inputsup} from '../../../utls/types/sign'
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../../validations/validate";
import toast from "react-hot-toast";
export default function SignUp() {

    const router = useRouter();

const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputsup>({
        resolver: zodResolver(signupSchema),}
  )
    const onSubmit: SubmitHandler<Inputsup> = async (data) => {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            toast.error(response.status === 409 ? "هذا البريد الإلكتروني مسجل بالفعل" : "تعذر إنشاء الحساب");
            return;
        }

        toast.success("تم إنشاء الحساب بنجاح");
        reset();
        router.replace('/login');
    };

    const handleSocialLogin = (provider: 'google' ) => {
        window.location.assign(`/api/auth/${provider}`);
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
                    <h1 className="text-3xl font-bold mb-2">Create an account</h1>
                    <p className="text-gray-300 text-sm">Let's help you set up your account, it won't take long.</p>
                </div>

                {/* الفورم (بدون فاليديشن - UI فقط) */}
                <form  onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1" >Name</label>
                        <input 
                         {...register("name")}
                            type="text" 
                            placeholder="Enter Name" 
                            className="w-full bg-transparent border border-gray-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#129575]"
                        />
                         {errors.name && (
                            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1" >Email</label>
                        <input  {...register("email")}
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
                        <input  {...register("password")}
                            type="password" 
                            placeholder="Enter Password" 
                            className="w-full bg-transparent border border-gray-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#129575]"
                        />
                         {errors.password && (
                            <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Confirm Password</label>
                        <input  {...register("confirmPass")}
                            type="password" 
                            placeholder="Confirm Password" 
                            className="w-full bg-transparent border border-gray-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#129575]"
                        />
                         {errors.confirmPass && (
                            <p className="text-red-400 text-xs mt-1">{errors.confirmPass.message}</p>
                        )}
                    </div>

                    {/* زر التسجيل */}
                    <button 
                        type="submit" 
                        className="w-full bg-[#129575] hover:bg-[#0f7d61] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-[#129575]/30 transition duration-300 mt-2"
                    >
                        Sign Up
                    </button>
                </form>

                {/* فاصل (Or Sign in With) */}
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="px-3 text-gray-400 text-xs">Or Sign Up With</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                {/* أزرار السوشيال ميديا */}
                <div className="flex justify-center gap-4 mb-6">
                    <button type="button" onClick={() => handleSocialLogin('google')} aria-label="Continue with Google" className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl border border-white/10 transition flex items-center justify-center w-16">
                        <FcGoogle className="text-2xl" />
                    </button>
                    
                </div>

                {/* زر الانتقال لصفحة الـ Sign In لو عنده حساب */}
                <div className="text-center text-sm text-gray-300">
                    Already have an account?{' '}
                    <Link href="/login" className="text-amber-400 font-semibold hover:underline">
                        Sign in
                    </Link>
                </div>

            </div>
        </div>
    );
}