"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Armchair, 
  User, 
  Mail, 
  Phone, 
  ArrowLeft,
  Copy,
  ExternalLink,
  ShieldCheck,
  MapPin
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Button } from "@/components/shared/Button";

export default function StatusCheckPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = (params?.id as string) || searchParams.get("id");
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    if (!id) {
      setLoading(false);
      setError("No user ID provided.");
      return;
    }

    try {
      // We use the cheak-status endpoint with query param or slug
      const res = await fetch(`/api/user/cheak-status/${id}`);
      const result = await res.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || "User not found or error fetching status.");
      }
    } catch (err) {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [id]);

  const copyStatusLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Status link copied!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">Checking your status...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Notice</h1>
          <p className="text-gray-500 mb-8">{error || "Could not find student data."}</p>
          <div className="flex flex-col gap-3">
            <Link 
              href="/register" 
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-2xl hover:bg-indigo-700 transition-all"
            >
              New Registration
            </Link>
            <Link href="/" className="text-gray-400 font-bold py-2">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const { user, seat } = data;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12 lg:p-24 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-bold group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
          </Link>
          <Button 
            variant="outline"
            onClick={copyStatusLink}
            className="flex items-center gap-2 text-indigo-600 border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 px-4 py-2 rounded-xl"
          >
            <Copy size={16} /> Share Link
          </Button>
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
          {/* Main Status Hero */}
          <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-3xl font-black text-indigo-200">
                {user.name.charAt(0)}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{user.name}</h1>
            <p className="text-indigo-600 font-bold inline-flex items-center gap-1">
              Member ID: <span className="tracking-widest uppercase opacity-60 ml-1">{id?.slice(-8) || "N/A"}</span>
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Verification Card */}
              <div className={`p-6 rounded-3xl border-2 transition-all ${
                user.status === "Active" 
                  ? "bg-green-50 border-green-100 ring-4 ring-green-50/50" 
                  : user.status === "Inactive"
                  ? "bg-red-50 border-red-100"
                  : "bg-amber-50 border-amber-100"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    user.status === "Active" ? "bg-green-500 text-white" : "bg-white text-gray-400"
                  }`}>
                    {user.status === "Active" ? <ShieldCheck size={20} /> : <Clock size={20} />}
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                    user.status === "Active" ? "bg-green-200 text-green-700" : "bg-amber-200 text-amber-700"
                  }`}>
                    {user.status}
                  </span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">Verification Status</h3>
                <p className="text-gray-500 text-sm">
                  {user.status === "Active" 
                    ? "Verified for all digital and offline library services." 
                    : "Your profile is under verification by admission desk."}
                </p>
              </div>

              {/* Seat Allocation Card */}
              <div className={`p-6 rounded-3xl border-2 transition-all ${
                seat 
                  ? "bg-indigo-50 border-indigo-100 ring-4 ring-indigo-50/50" 
                  : "bg-gray-50 border-gray-100 opacity-60"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    seat ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-gray-300"
                  }`}>
                    <Armchair size={20} />
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                    seat ? "bg-indigo-200 text-indigo-700" : "bg-gray-200 text-gray-400"
                  }`}>
                    {seat ? "Allocated" : "N/A"}
                  </span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">Seat Allocation</h3>
                <p className="text-gray-500 text-sm">
                  {seat 
                    ? `You have been allocated Seat No. ${seat.seatNumber} in Room ${seat.roomNumber || 'A'}.` 
                    : "Seat allocation will be processed after verification."}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-gray-900 font-bold">{user.email}</p>
                </div>
             </div>
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                  <p className="text-gray-900 font-bold">{user.phone}</p>
                </div>
             </div>
          </div>

          {/* Next Steps for Inactive/Pending */}
          {user.status !== "Active" && (
             <div className="bg-amber-600 rounded-3xl p-8 text-white shadow-xl shadow-amber-100 overflow-hidden relative">
                <div className="relative z-10">
                  <h3 className="text-xl font-black mb-2">Requirement: Final Verification</h3>
                  <p className="opacity-90 max-w-lg mb-6">
                    Please visit the library entrance desk with your Aadhar Card and a physical copy of your registration for the final biometric verification.
                  </p>
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center gap-2 bg-white text-amber-700 px-6 py-2.5 rounded-xl font-black hover:bg-amber-50 transition-all"
                  >
                    View Desk Location <ExternalLink size={16} />
                  </Link>
                </div>
                <Clock size={120} className="absolute -right-10 -bottom-10 opacity-20 rotate-12" />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
