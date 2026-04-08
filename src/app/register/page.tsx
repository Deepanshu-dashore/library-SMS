"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Calendar, MapPin, ChevronRight, CheckCircle2, ExternalLink, Copy } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [registeredId, setRegisteredId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    dob: "",
    maritalStatus: "Unmarried",
    number: "",
    secondaryNumber: "",
    category: "General",
    gender: "Male",
    address: {
      detailedAddress: "",
      tehsil: "",
      district: "",
      state: "",
      pincode: "",
    },
    email: "",
    adharNumber: "",
    course: "",
    notes: "",
    photo: "",
    signature: "",
    status: "Pending",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 5) return; // Only submit on final step

    const loadingToast = toast.loading("Registering your membership...");

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "address") {
          Object.keys(formData.address).forEach((addrKey) => {
            formDataToSend.append(`address.${addrKey}`, formData.address[addrKey as keyof typeof formData.address]);
          });
        } else if (key === "photo" || key === "signature") {
          if ((formData as any)[key]) {
            formDataToSend.append(key, (formData as any)[key]);
          }
        } else {
          formDataToSend.append(key, (formData as any)[key]);
        }
      });

      const res = await fetch("/api/user/register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Registration successful!", { id: loadingToast });
        setRegisteredId(data.data._id);
        setSubmitted(true);
      } else {
        toast.error(data.message || "Registration failed", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", { id: loadingToast });
    }
  };

  if (submitted && registeredId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 selection:bg-indigo-100">
        <div className="max-w-xl w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-600 rounded-[32px] rotate-12 shadow-xl shadow-green-100/50">
            <CheckCircle2 size={56} />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase italic">Awww, Welcome!</h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-sm mx-auto">
              Your member profile has been registered successfully. You can now track your allocation.
            </p>
          </div>

          <div className="bg-gray-50 rounded-[32px] p-8 border-2 border-dashed border-gray-200 relative group transition-all">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Registration ID</p>
             <p className="text-3xl font-black text-indigo-600 tracking-widest uppercase italic">{registeredId.slice(-10)}</p>
             
             <div className="mt-8 flex flex-col gap-3">
                <Link 
                  href={`/status/${registeredId}`} 
                  className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-100"
                >
                  Track Status <ExternalLink size={20} />
                </Link>
                <button 
                  onClick={() => {
                    const url = `${window.location.origin}/status/${registeredId}`;
                    navigator.clipboard.writeText(url);
                    toast.success("Track Link copied!");
                  }}
                  className="w-full bg-white border border-gray-200 text-gray-500 font-bold py-3 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <Copy size={18} /> Copy Track Link
                </button>
             </div>
          </div>
          
          <div className="pt-4 flex flex-col items-center gap-6">
             <div className="h-0.5 w-12 bg-gray-100"></div>
             <Link href="/" className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors">Home Page</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col lg:flex-row overflow-hidden">
      {/* Left Decoration Side (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/3 bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden text-white">
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
            <Link href="/" className="text-3xl font-black italic">L</Link>
          </div>
          <h2 className="text-5xl font-black leading-tight mb-8">
            Join Our <br /> <span className="text-indigo-200 underline decoration-indigo-300 decoration-8 underline-offset-8">Community</span>
          </h2>
          <p className="text-indigo-100 text-xl leading-relaxed max-w-sm">
            Unlock access to thousands of books, resources and shared learning spaces.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-bold">Instant Access</p>
              <p className="text-indigo-200 text-sm">Register in under 2 minutes</p>
            </div>
          </div>
          <p className="text-indigo-400 text-sm pt-8">© 2026 Virtual Library SMS Platform</p>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Form Side */}
      <div className="flex-1 p-6 md:p-12 lg:p-24 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12">
            <Link href="/" className="lg:hidden block mb-8 text-indigo-600 font-bold tracking-tighter text-2xl italic">LIBRARY SMS</Link>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Member Registration</h1>
            <p className="text-gray-500 mt-2">Personal details required for your unique library ID</p>
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-2 mb-12">
            {[1, 2, 3, 4, 5].map((s) => (
              <div 
                key={s}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  step >= s ? "bg-indigo-600 shadow-sm shadow-indigo-100" : "bg-gray-200"
                }`}
              ></div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 pb-20">
            {/* Step 1: Personal */}
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                <div className="flex items-center gap-3 text-indigo-600 font-bold mb-4">
                  <User size={20} />
                  <span>Personal Credentials</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Student Full Name *</label>
                    <input 
                      required
                      type="text"
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email Address *</label>
                    <input 
                      required
                      type="email"
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Father&apos;s Name *</label>
                    <input 
                      required
                      type="text"
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Mother&apos;s Name *</label>
                    <input 
                      required
                      type="text"
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                      value={formData.motherName}
                      onChange={(e) => setFormData({...formData, motherName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Date of Birth *</label>
                    <input 
                      required
                      type="date"
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Gender *</label>
                    <select 
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-8">
                  <button 
                    type="button" 
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                  >
                    Contact Info <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Contact & Identity */}
            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                <div className="flex items-center gap-3 text-indigo-600 font-bold mb-4">
                  <Phone size={20} />
                  <span>Contact & Identity</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Primary Mobile *</label>
                    <input 
                      required
                      type="tel"
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                      placeholder="+91"
                      value={formData.number}
                      onChange={(e) => setFormData({...formData, number: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Secondary Mobile</label>
                    <input 
                      type="tel"
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                      value={formData.secondaryNumber}
                      onChange={(e) => setFormData({...formData, secondaryNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Aadhar Card Number *</label>
                    <input 
                      required
                      type="text"
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                      placeholder="**** **** ****"
                      value={formData.adharNumber}
                      onChange={(e) => setFormData({...formData, adharNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Student Category *</label>
                    <select 
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="General">General</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="OBC">OBC</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="text-gray-500 font-bold hover:text-indigo-600 transition-colors"
                  >
                    Go Back
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                  >
                    Address Details <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Address & Submit */}
            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                <div className="flex items-center gap-3 text-indigo-600 font-bold mb-4">
                  <MapPin size={20} />
                  <span>Residential Address</span>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Full Address *</label>
                    <textarea 
                      required
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                      rows={3}
                      value={formData.address.detailedAddress}
                      onChange={(e) => setFormData({
                        ...formData, 
                        address: {...formData.address, detailedAddress: e.target.value}
                      })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Tehsil *</label>
                      <input 
                        required
                        type="text"
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                        value={formData.address.tehsil}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: {...formData.address, tehsil: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">District *</label>
                      <input 
                        required
                        type="text"
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                        value={formData.address.district}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: {...formData.address, district: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">State *</label>
                      <input 
                        required
                        type="text"
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                        value={formData.address.state}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: {...formData.address, state: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Pincode *</label>
                      <input 
                        required
                        type="text"
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                        value={formData.address.pincode}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: {...formData.address, pincode: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <button 
                    type="button" 
                    onClick={() => setStep(2)}
                    className="text-gray-500 font-bold hover:text-indigo-600 transition-colors"
                  >
                    Go Back
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                  >
                    Final Info <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Final Info & Submit */}
            {step === 4 && (
              <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                <div className="flex items-center gap-3 text-indigo-600 font-bold mb-4">
                  <CheckCircle2 size={20} />
                  <span>Final Information</span>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2 pt-4">
                    <label className="text-sm font-bold text-gray-700">Applying for Course/Exam</label>
                    <input 
                      type="text"
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                      placeholder="e.g. Competitive Exams, Academic, etc."
                      value={formData.course}
                      onChange={(e) => setFormData({...formData, course: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Photo Upload</label>
                      <input 
                        type="file"
                        accept="image/*"
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        onChange={(e) => setFormData({...formData, photo: e.target.files?.[0] as any})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Signature Upload</label>
                      <input 
                        type="file"
                        accept="image/*"
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        onChange={(e) => setFormData({...formData, signature: e.target.files?.[0] as any})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Addition Notes</label>
                    <textarea 
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <button 
                    type="button" 
                    onClick={() => setStep(3)}
                    className="text-gray-500 font-bold hover:text-indigo-600 transition-colors"
                  >
                    Go Back
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStep(5)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                  >
                    Preview Details
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Preview & Final Submit */}
            {step === 5 && (
              <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                <div className="flex items-center gap-3 text-indigo-600 font-bold mb-4">
                  <CheckCircle2 size={20} />
                  <span>Preview Registration</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div><span className="text-gray-500">Name:</span> <p className="font-bold">{formData.name || "-"}</p></div>
                  <div><span className="text-gray-500">Email:</span> <p className="font-bold">{formData.email || "-"}</p></div>
                  <div><span className="text-gray-500">Mobile:</span> <p className="font-bold">{formData.number || "-"}</p></div>
                  <div><span className="text-gray-500">DOB:</span> <p className="font-bold">{formData.dob || "-"}</p></div>
                  <div><span className="text-gray-500">Gender:</span> <p className="font-bold">{formData.gender || "-"}</p></div>
                  <div><span className="text-gray-500">Aadhar:</span> <p className="font-bold">{formData.adharNumber || "-"}</p></div>
                  <div className="col-span-2"><span className="text-gray-500">Course:</span> <p className="font-bold">{formData.course || "-"}</p></div>
                  <div className="col-span-2"><span className="text-gray-500">Address:</span> <p className="font-bold">{formData.address.detailedAddress}, {formData.address.tehsil}, {formData.address.district}, {formData.address.state} - {formData.address.pincode}</p></div>
                  <div><span className="text-gray-500">Photo Attached:</span> <p className="font-bold font-mono text-indigo-500">{formData.photo ? (formData.photo as any).name || "Yes" : "No"}</p></div>
                  <div><span className="text-gray-500">Signature Attached:</span> <p className="font-bold font-mono text-indigo-500">{formData.signature ? (formData.signature as any).name || "Yes" : "No"}</p></div>
                </div>

                <div className="flex justify-between pt-8">
                  <button 
                    type="button" 
                    onClick={() => setStep(4)}
                    className="text-gray-500 font-bold hover:text-indigo-600 transition-colors"
                  >
                    Go Back
                  </button>
                  <button 
                    type="submit" 
                    className="flex items-center gap-2 bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                  >
                    Finish Registration
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
