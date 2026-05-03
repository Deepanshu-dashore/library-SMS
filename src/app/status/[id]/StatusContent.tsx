"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { 
  Check,
  ShieldCheck,
  Armchair,
  Rocket,
  Info
} from "lucide-react";
import { motion } from "framer-motion";

// --- Sub-components ---

const ProgressStep = ({ completed, current, label, id }: { completed: boolean; current?: boolean; label: string; id: number }) => (
  <div className="flex flex-col items-center flex-1 relative">
    <div 
        className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10
            ${completed ? 'bg-[#98c156] text-white shadow-lg shadow-[#98c156]/20' : 'bg-white text-gray-200'}
            ${current ? 'ring-4 ring-[#98c156]/20 border-2 border-[#98c156]' : ''}
        `}
    >
      <Check size={18} className={completed ? "scale-100" : "scale-0 transition-transform"} />
    </div>
    <span className={`mt-2 text-[9px] md:text-[10px] font-bold tracking-tight ${completed || current ? 'text-slate-800' : 'text-slate-400'}`}>
        {label}
    </span>
    {id < 5 && (
        <div className="absolute top-4 md:top-5 left-[60%] w-[80%] h-[2px] bg-slate-50 -z-0">
            <div 
                className={`h-full bg-[#98c156] transition-all duration-1000`} 
                style={{ width: completed ? '100%' : '0%' }}
            />
        </div>
    )}
  </div>
);

const DetailItem = ({ icon, title, description, colorClass }: any) => (
    <div className="flex gap-4 mb-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white shadow-md ${colorClass}`}>
            {React.cloneElement(icon as any, { size: 20 })}
        </div>
        <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-bold text-slate-800 leading-tight">{title}</h3>
            <p className="text-[13px] text-slate-500 font-medium leading-normal max-w-sm">{description}</p>
        </div>
    </div>
);

export default function StatusContent() {
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
      const res = await fetch(`/api/user/cheak-status/${id}`);
      const result = await res.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || "Member not found.");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-6 font-public-sans">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-[5px] border-white border-t-[#98c156] rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Verifying...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-6 font-public-sans">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-xl text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 font-black text-3xl">!</div>
          <h1 className="text-xl font-black text-slate-900 mb-2">Notice</h1>
          <p className="text-slate-500 mb-8 font-medium text-sm">{error || "The requested record could not be found."}</p>
          <button onClick={() => window.location.href = '/'} className="text-[#98c156] text-sm font-bold">Return Home</button>
        </motion.div>
      </div>
    );
  }

  const { user, seat } = data;
  
  const steps = [
    { label: "Submitted", completed: true },
    { label: "In Review", completed: user.status !== "Pending" },
    { label: "Verified", completed: user.status === "Active" },
    { label: "Allocated", completed: !!seat },
    { label: "All Set", completed: user.status === "Active" && !!seat },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] py-8 px-6 flex flex-col items-center justify-center font-public-sans">
      <div className="w-full max-w-xl">
        
        {/* Main Card */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/40 border border-white"
        >
            {/* Header / Stepper Section */}
            <div className="bg-slate-50/50 p-8 md:p-10 border-b border-slate-100">
                <h1 className="text-2xl font-black text-slate-900 mb-8 tracking-tight text-center">Registration Status</h1>
                
                <div className="flex justify-between items-start">
                    {steps.map((s, idx) => (
                        <ProgressStep key={idx} id={idx + 1} label={s.label} completed={s.completed} current={steps.findIndex(st => !st.completed) === idx} />
                    ))}
                </div>
            </div>

            {/* Content / Details Section */}
            <div className="bg-white p-8 md:p-10">
                <div className="flex flex-col items-start gap-1 mb-10 text-center w-full">
                   <h2 className="text-xl font-black text-slate-900 tracking-tight w-full">Welcome, <span className="text-[#98c156]">{user.name}</span>!</h2>
                   <p className="text-slate-400 font-medium text-xs w-full text-center">
                      Current overview of your membership verification status.
                   </p>
                </div>

                <div className="space-y-1">
                    <DetailItem 
                        icon={<ShieldCheck />}
                        title="Verification Milestone"
                        colorClass="bg-[#fb923c]"
                        description={
                            user.status === "Active" 
                            ? "Your ID has been successfully verified by our team."
                            : "Your biometric verification is currently being processed."
                        }
                    />

                    <DetailItem 
                        icon={<Armchair />}
                        title="Seat Selection Status"
                        colorClass="bg-[#ef4444]"
                        description={
                            seat 
                            ? `Seat ${seat.seatNumber} in Room ${seat.roomNumber || 'A'}. Ready to use!`
                            : "Seat allocation is pending final biometric verification."
                        }
                    />

                    <DetailItem 
                        icon={<Rocket />}
                        title="Next Steps"
                        colorClass="bg-indigo-500"
                        description="If pending, visit the entrance with your physical Aadhar card."
                    />
                </div>

                {/* Important Notice Footer */}
                <div className="mt-10 pt-8 border-t border-slate-50">
                    <div className="bg-slate-50 rounded-xl p-5 flex items-start gap-3 border border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shrink-0 shadow-sm border border-slate-100">
                            <Info size={16} />
                        </div>
                        <p className="text-[12px] text-slate-600 font-semibold leading-relaxed">
                            If your application is pending for more than <span className="text-red-500 font-bold">7 days</span>, please connect with the library administration directly.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Branding Footer */}
        <p className="mt-8 text-center text-slate-300 font-bold text-[9px] uppercase tracking-[0.2em]">
            Library SMS Portal
        </p>
      </div>
    </div>
  );
}
