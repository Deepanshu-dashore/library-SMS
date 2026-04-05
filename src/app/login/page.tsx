"use client";

import React, { useState } from "react";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 relative overflow-hidden font-sans">
      {/* Subtle Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/40 blur-[150px] rounded-full" />

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-tr from-blue-600 to-purple-600 shadow-xl shadow-blue-600/20 ring-1 ring-white/20">
            <LogIn className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-500">Sign in to manage your library resources</p>
        </div>

        <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-2xl shadow-gray-200/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl bg-gray-50/50 border border-gray-200 py-3.5 pl-12 pr-4 text-gray-900 placeholder-gray-300 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all transition-duration-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</label>
                <button type="button" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl bg-gray-50/50 border border-gray-200 py-3.5 pl-12 pr-4 text-gray-900 placeholder-gray-300 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all transition-duration-300"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 focus:scale-[0.98] active:scale-95 transition-all text-sm tracking-wide"
            >
              Sign In to Library
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-8 relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100"></span>
              </div>
              <span className="relative bg-white px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Login with</span>
          </div>

          <div className="mt-8 flex gap-3">
            <button className="flex-1 flex h-12 items-center justify-center rounded-2xl border border-gray-100 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-all group">
              <svg className="h-5 w-5 mr-2 text-gray-400 group-hover:text-gray-900 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-tight">Github</span>
            </button>
            <button className="flex-1 flex h-12 items-center justify-center rounded-2xl border border-gray-100 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-all group">
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-tight">Google</span>
            </button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs text-gray-400">
          Already have an account? <span className="text-blue-600 font-bold cursor-pointer hover:underline">Contact Admin</span>
        </p>
      </div>
    </div>
  );
}
