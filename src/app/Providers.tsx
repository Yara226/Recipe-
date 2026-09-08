"use client"
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { store } from "../store/index"
import { Provider } from "react-redux";

const protectedPaths = [
     "/home",
     "/items",
     "/adding",
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

          if (requiresAuth && !localStorage.getItem("currentUser")) {
               router.replace("/login");
               return;
          }

          setIsCheckingAuth(false);
     }, [pathname, router]);

     if (isCheckingAuth) return null;

     return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
           return (
                <Provider store={store}>
                     <AuthGuard>{children}</AuthGuard>
                </Provider>
           );
}