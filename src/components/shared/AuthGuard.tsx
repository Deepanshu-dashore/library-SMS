"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify");
        const data = await response.json();

        if (!response.ok || !data.success) {
          // If the token is missing or invalid, redirect to login
          if (pathname !== "/login") {
            router.push("/login");
          }
        } else {
           // Auth successful, allow access
        }
      } catch (error) {
        if (pathname !== "/login") {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

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
