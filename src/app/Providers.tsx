"use client"
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { store } from "../store/index"
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

const protectedPaths = [
     "/home",
     "/items",
     "/adding",
     "/added",
     "/notifications",
     "/profile",
     "/saved",
];

function AuthGuard({ children }: { children: React.ReactNode }) {
     const pathname = usePathname();
     const router = useRouter();
     const [isCheckingAuth, setIsCheckingAuth] = useState(true);

     useEffect(() => {
          const requiresAuth = protectedPaths.some(
               (path) => pathname === path || pathname.startsWith(`${path}/`),
          );

          if (!requiresAuth) {
               setIsCheckingAuth(false);
               return;
          }

          fetch('/api/auth/me')
               .then((response) => {
                    if (!response.ok) router.replace("/login");
               })
               .finally(() => setIsCheckingAuth(false));
     }, [pathname, router]);

     if (isCheckingAuth) return null;

     return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
           return (
                <Provider store={store}>
                     <AuthGuard>{children}</AuthGuard>
                     <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
                </Provider>
           );
}