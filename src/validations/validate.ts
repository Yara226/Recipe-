import { z } from 'zod';
export const signinSchema=z.object({
    email:z.string().email({message:"البريد الاكترونى غر صحيح"}),
    password:z.string().min(6,{message:"كلمه المرور لا يجب ان تكون اقل من 12 "})
})
export const signupSchema=z.object({
    name:z.string().min(2,{message:"يجب ان لا يقل الاسم عن حرفان "}),
    email:z.string().email({message:"البريد الاكترونى غر صحيح"}),
    password:z.string().min(6,{message:"كلمه المرور لا يجب ان تكون اقل من 12 "}),
    confirmPass:z.string(),
}).refine((data) => {
    // يجب استخدام return لإرجاع نتيجة المقارنة
    return data.password === data.confirmPass;
}, {
    message: "كلمتا المرور غير متطابقتان",
    path: ["confirmPass"], // تم تصحيحها من pass إلى path
});
type signinFormvalues=z.infer<typeof signinSchema>
type signupFormvalues=z.infer<typeof signupSchema>
