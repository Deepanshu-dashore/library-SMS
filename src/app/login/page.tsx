"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { proxy } from "@/app/lib/proxy";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/verify");
        const data = await response.json();
        if (response.ok && data.success) {
          router.push("/");
        }
      } catch (error) {
        // Not logged in, stay on login page
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuthStatus();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await proxy("/api/auth/login", "POST", { email, password });
      
      if (response.success) {
        toast.success("Login Successful!");
        router.push("/");
      } else {
        toast.error(response.message || "Invalid credentials");
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900/10 relative font-sans">
      {/* Background image overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center blur-[1px]"
        style={{ backgroundImage: "url('/login-bg.png')" }}
      />

      <div className="w-full max-w-md p-6 relative z-10">
        <div className="bg-white rounded-lg shadow-2xl p-10 md:p-12 space-y-8">


          {/* Heading Section */}
          <div className="space-y-3">
             <h1 className="text-[1.6rem] font-bold text-[#1e293b] leading-tight">Welcome back to LMS</h1>
             <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Sign in to access your dashboard and manage your business efficiently
px             </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                disabled={loading}
                required
              />
            </div>

            {/* <div className="flex items-center justify-start">
               <p className="text-[13px] font-medium text-gray-500">
                  Don't have an account? <span className="text-blue-600 font-bold cursor-pointer hover:underline">Create Account</span>
               </p>
            </div> */}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center h-14 bg-[#4f46e5] rounded-xl text-white font-bold text-[15px] hover:bg-[#4338ca] transition-all transform active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
            </button>
          </form>

          {/* Footer Footer */}
          <div className="text-center">
             <p className="text-[11px] font-medium text-gray-400 leading-relaxed px-4">
               By continue your agree to our <span className="text-blue-500 font-bold border-b border-blue-100 pb-0.5 whitespace-nowrap">Terms of use</span> and <span className="text-blue-500 font-bold border-b border-blue-100 pb-0.5 whitespace-nowrap">Privacy Policy</span>
             </p>
          </div>

        </div>
      </div>
    </div>
  );
}
