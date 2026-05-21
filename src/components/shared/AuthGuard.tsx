"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUserSuccess, logoutUser } from "@/store/userSlice";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", { credentials: "include" });
        const data = await response.json();
        if (!response.ok || !data.success || response.status === 404 || response.status === 401) {
          dispatch(logoutUser());
          if (pathname !== "/login") {
            router.replace("/login");
          }
        } else {
           // Auth successful, allow access
           dispatch(setUserSuccess(data.data));
        }
      } catch (error) {
        dispatch(logoutUser());
        if (pathname !== "/login") {
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router, dispatch]);

  if (loading) {
     return (
       <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
             <p className="text-gray-500 font-medium animate-pulse">Authenticating...</p>
          </div>
       </div>
     );
  }

  return <>{children}</>;
}
