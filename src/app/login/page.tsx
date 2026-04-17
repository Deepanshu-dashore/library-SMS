"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { proxy } from "@/app/lib/proxy";
import toast from "react-hot-toast";
import DecryptedText from "@/components/shared/DecryptedText";
import Image from "next/image";

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
        className="absolute inset-0 z-0 bg-cover bg-center blur-[3px]"
        style={{ backgroundImage: "url('/login-bg.png')" }}
      />
      <div 
        className="absolute inset-0 z-1 bg-cover bg-center bg-white/10 blur-[2px]"
      />

      {/* Main Container */}
      <div className="w-full max-w-5xl px-6 relative z-10 flex flex-col md:flex-row items-center justify-center">
        
        {/* Left Side: Image Illustration */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-white h-auto self-stretch rounded-l-lg shadow-2xl p-10 border-r border-gray-100 min-h-[550px]">
           <img 
              src="/loginSide.png" 
              alt="Login Side Illustration" 
              className="w-full h-auto object-contain bg-white"
              loading="eager"
           />
        </div>

        {/* Right Side: Form (Restored original UI) */}
        <div className="w-full max-w-md bg-white rounded-lg md:rounded-l-none md:rounded-r-lg shadow-2xl p-10 md:p-10  space-y-8 h-auto min-h-[550px] flex flex-col justify-center">

          {/* Logo Section */}
          <div className="mb-2 flex gap-4 items-center">
            <img 
               src="/LogoWithoutBg.png" 
               alt="Library Management Software" 
               className="w-10 h-10 object-contain"
               loading="eager"
            />
             <div>
              <h1 className="text-lg text-gray-600 font-public-sans font-bold" style={{ color: "var(--text)" }}>
                  Library SMS
                </h1>
                </div>
          </div>

          {/* Heading Section */}
          <div className="space-y-2 mb-3">
             <h1 className="text-[1.6rem] text-base font-public-sans font-bold text-[#1e293b] leading-tight">Welcome back lets get you in</h1>
             <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Sign in to access your dashboard and manage your business efficiently
             </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mt-5">
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg mt-2 border border-gray-200 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-sm font-bold text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg mt-2 border border-gray-200 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                disabled={loading}
                required
              />
            </div>
            <div className="h-1"></div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 cursor-pointer flex items-center justify-center h-14 bg-[#4f46e5] rounded-xl text-white font-bold text-[15px] hover:bg-[#4338ca] transition-all transform active:scale-95 shadow-lg shadow-indigo-500/20 px-0"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <DecryptedText 
                  text="Sign In" 
                  animateOn="hover"
                  speed={100}
                  maxIterations={20}
                  revealDirection="center"
                  parentClassName="w-full h-full"
                  className="font-bold whitespace-nowrap" 
                />
              )}
            </button>
          </form>

          {/* Footer Footer */}
          {/* <div className="text-center">
             <p className="text-[11px] font-medium text-gray-400 leading-relaxed px-4">
               By continue your agree to our <span className="text-blue-500 font-bold border-b border-blue-100 pb-0.5 whitespace-nowrap">Terms of use</span> and <span className="text-blue-500 font-bold border-b border-blue-100 pb-0.5 whitespace-nowrap">Privacy Policy</span>
             </p>
          </div> */}

        </div>
      </div>
    </div>
  );
}
