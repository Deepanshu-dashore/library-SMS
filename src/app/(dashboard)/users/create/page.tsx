"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { User, Phone, MapPin, CheckCircle2, Save, X, Building, Mail, CreditCard, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/shared/Button";

export default function CreateUserPage() {
  const router = useRouter();
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
    status: "Active", // By default Admin adds as Active
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating new member...");

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Member created successfully!", { id: loadingToast });
        router.push("/users");
      } else {
        toast.error(data.message || "Failed to create user", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToast });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <PageHeader 
        title="Create New Member"
        backLink="/users"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Users", href: "/users" },
          { label: "Create" }
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Personal Details */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 ring-1 ring-gray-100">
           <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">01</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Personal Credentials</h3>
                <p className="text-sm text-gray-500">Identity and basic background information</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Full Name *</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Email Address *</label>
                <input 
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Father's Name *</label>
                <input 
                  required
                  type="text"
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Mother's Name *</label>
                <input 
                  required
                  type="text"
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                  value={formData.motherName}
                  onChange={(e) => setFormData({...formData, motherName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Date of Birth *</label>
                <input 
                  required
                  type="date"
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Marital Status *</label>
                <select 
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none appearance-none"
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})}
                >
                  <option value="Unmarried">Unmarried</option>
                  <option value="Married">Married</option>
                </select>
              </div>
           </div>
        </div>

        {/* Step 2: Contact & Identity */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 ring-1 ring-gray-100">
           <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">02</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Contact & Security</h3>
                <p className="text-sm text-gray-500">How we can reach and identify the member</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Mobile Number *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    required
                    type="tel"
                    placeholder="+91"
                    className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-600 transition-all outline-none"
                    value={formData.number}
                    onChange={(e) => setFormData({...formData, number: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Secondary Number</label>
                <input 
                  type="tel"
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                  value={formData.secondaryNumber}
                  onChange={(e) => setFormData({...formData, secondaryNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Aadhar Number *</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    required
                    type="text"
                    placeholder="**** **** ****"
                    className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                    value={formData.adharNumber}
                    onChange={(e) => setFormData({...formData, adharNumber: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Gender *</label>
                <select 
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none appearance-none"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Category *</label>
                <select 
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="General">General</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="OBC">OBC</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Course/Goal</label>
                <input 
                  type="text"
                  placeholder="e.g. UPSC, CA"
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                />
              </div>
           </div>
        </div>

        {/* Step 3: Residential Address */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 ring-1 ring-gray-100">
           <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold">03</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Residential Address</h3>
                <p className="text-sm text-gray-500">Where the member stays currently</p>
              </div>
           </div>

           <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Detailed Address *</label>
                <textarea 
                  required
                  rows={2}
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-600 transition-all outline-none resize-none"
                  value={formData.address.detailedAddress}
                  onChange={(e) => setFormData({...formData, address: {...formData.address, detailedAddress: e.target.value}})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Tehsil *</label>
                  <input 
                    required
                    type="text"
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-600 transition-all outline-none"
                    value={formData.address.tehsil}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, tehsil: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">District *</label>
                  <input 
                    required
                    type="text"
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-600 transition-all outline-none"
                    value={formData.address.district}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, district: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">State *</label>
                  <input 
                    required
                    type="text"
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-600 transition-all outline-none"
                    value={formData.address.state}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Pincode *</label>
                  <input 
                    required
                    type="text"
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-600 transition-all outline-none"
                    value={formData.address.pincode}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, pincode: e.target.value}})}
                  />
                </div>
              </div>
           </div>
        </div>

        {/* Step 4: Final Information */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 ring-1 ring-gray-100">
           <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center font-bold">04</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Media & Verification</h3>
                <p className="text-sm text-gray-500">Status, photo and official remarks</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Photo URL</label>
                <input 
                  type="text"
                  placeholder="Link to profile photo"
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:border-pink-600 transition-all outline-none"
                  value={formData.photo}
                  onChange={(e) => setFormData({...formData, photo: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Signature URL</label>
                <input 
                  type="text"
                  placeholder="Link to signature"
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:border-pink-600 transition-all outline-none"
                  value={formData.signature}
                  onChange={(e) => setFormData({...formData, signature: e.target.value})}
                />
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Internal Notes</label>
                <textarea 
                  rows={2}
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
              
              <div className="space-y-4 col-span-1 md:col-span-2">
                 <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Membership Status</label>
                 <div className="flex flex-wrap gap-4">
                    {["Active", "Inactive", "Unverify"].map((status) => (
                      <Button
                        key={status}
                        type="button"
                        onClick={() => setFormData({ ...formData, status })}
                        variant={formData.status === status ? "primary" : "secondary"}
                        className={`px-8 py-3 rounded-2xl text-[14px] font-black transition-all ${
                          formData.status === status
                            ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {status}
                      </Button>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-4 pt-10">
           <Button 
             type="submit"
             variant="primary"
             className="flex-1 py-5 rounded-[24px] text-lg font-black hover:bg-indigo-700 shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 bg-indigo-600 outline-none border-none"
           >
             <Save size={24} /> Create Member Profile
           </Button>
           <Button 
             type="button"
             variant="outline"
             onClick={() => router.push("/users")}
             className="px-10 py-5 bg-white border border-gray-200 text-gray-500 font-bold rounded-[24px] hover:bg-gray-50"
           >
             Cancel
           </Button>
        </div>
      </form>
    </div>
  );
}
