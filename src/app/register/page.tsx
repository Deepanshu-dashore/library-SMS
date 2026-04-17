"use client";

import React, { useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import Link from "next/link";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import { Stepper, Step } from "@/components/shared/Stepper";

const inputBase = "w-full text-[14px] font-semibold px-11 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none text-gray-700 placeholder:text-gray-400 placeholder:font-normal shadow-sm group-hover:border-indigo-200";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [registeredId, setRegisteredId] = useState<string | null>(null);
  
  // Cropper States
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

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
    photo: null as File | null,
    signature: null as File | null,
    status: "Pending",
  });

  const steps: Step[] = [
    { id: 1, title: "Identity", icon: () => <Icon icon="solar:user-bold-duotone" className="w-6 h-6" /> },
    { id: 2, title: "Contact", icon: () => <Icon icon="solar:phone-calling-bold-duotone" className="w-6 h-6" /> },
    { id: 3, title: "Address", icon: () => <Icon icon="solar:home-2-bold-duotone" className="w-6 h-6" /> },
    { id: 4, title: "Media", icon: () => <Icon icon="solar:camera-bold-duotone" className="w-6 h-6" /> },
    { id: 5, title: "Review", icon: () => <Icon icon="solar:magnifer-bold-duotone" className="w-6 h-6" /> },
  ];

  const onCropComplete = useCallback((_initialed: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApplyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImageBlob) {
        const file = new File([croppedImageBlob], "photo.jpg", { type: "image/jpeg" });
        setFormData({ ...formData, photo: file });
        setIsCropping(false);
        setImageSrc(null);
        toast.success("Photo cropped perfectly!");
      }
    } catch (e) {
      toast.error("Failed to crop image");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "photo" | "signature") => {
    const file = e.target.files?.[0];
    if (file) {
      if (field === "photo") {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImageSrc(reader.result as string);
          setIsCropping(true);
        });
        reader.readAsDataURL(file);
      } else {
        setFormData({ ...formData, signature: file });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 5) return;

    const loadingToast = toast.loading("Processing your membership...");

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "address") {
          Object.keys(formData.address).forEach((addrKey) => {
            formDataToSend.append(`address.${addrKey}`, formData.address[addrKey as keyof typeof formData.address]);
          });
        } else if (key === "photo" || key === "signature") {
          const file = (formData as any)[key];
          if (file) formDataToSend.append(key, file);
        } else {
          formDataToSend.append(key, (formData as any)[key]);
        }
      });

      const res = await fetch("/api/user/register", { method: "POST", body: formDataToSend });
      const data = await res.json();

      if (data.success) {
        toast.success("Welcome aboard!", { id: loadingToast });
        setRegisteredId(data.data._id);
        setSubmitted(true);
      } else {
        toast.error(data.message || "Registration failed", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Connection error. Try again.", { id: loadingToast });
    }
  };

  if (submitted && registeredId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 lg:p-12 font-public-sans animate-in fade-in zoom-in duration-700">
        <div className="max-w-xl w-full text-center flex flex-col items-center">
          <div className="relative group mb-10">
             <div className="absolute inset-0 bg-emerald-400 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
             <div className="relative w-28 h-28 bg-emerald-500 text-white rounded-[32px] flex items-center justify-center rotate-6 group-hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-emerald-200">
                <Icon icon="solar:verified-check-bold-duotone" className="text-6xl" />
             </div>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight italic uppercase mb-2">Registration Success</h1>
          <p className="text-gray-400 font-medium mb-12 max-w-sm">Welcome to our library ecosystem! Your digital membership is now active.</p>

          <div className="w-full bg-gray-50/50 rounded-[40px] p-10 border border-gray-100 relative mb-12 flex flex-col items-center group overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon icon="solar:crown-minimalistic-bold-duotone" className="text-amber-400 text-3xl" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-2">Your Unique Member ID</p>
             <p className="text-4xl font-black text-gray-900 tracking-widest uppercase italic mb-8 select-all decoration-indigo-200 decoration-8 underline-offset-[10px] underline">{registeredId.slice(-8)}</p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full relative z-10">
                <Link 
                   href={`/status/${registeredId}`} 
                   className="flex items-center justify-center gap-3 bg-indigo-600 text-white font-black py-4.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                >
                   Track Status <Icon icon="solar:map-point-wave-bold-duotone" className="text-xl" />
                </Link>
                <button 
                   onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/status/${registeredId}`);
                      toast.success("URL Copied!");
                   }}
                   className="flex items-center justify-center gap-3 bg-white border border-gray-100 text-gray-900 font-black py-4.5 rounded-2xl hover:bg-gray-100 transition-all shadow-sm active:scale-95"
                >
                   Share Link <Icon icon="solar:link-bold-duotone" className="text-xl" />
                </button>
             </div>
          </div>
          
          <Link href="/" className="text-sm font-black text-gray-400 hover:text-indigo-600 transition-all flex items-center gap-2 group">
             <Icon icon="solar:round-alt-arrow-left-bold-duotone" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
             Return Home
          </Link>
        </div>
      </div>
    );
  }

  const InputCard = ({ icon, label, children, active }: any) => (
    <div className={`space-y-6 animate-in duration-500 ${active ? "slide-in-from-right-8 opacity-100" : "opacity-0 hidden"}`}>
      <div className="flex items-center gap-4 mb-4">
         <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-100">
            <Icon icon={icon} className="text-2xl" />
         </div>
         <div className="flex flex-col">
            <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">{label}</h3>
            <p className="text-xs font-semibold text-gray-400 italic">Please fill accurate information</p>
         </div>
      </div>
      {children}
    </div>
  );

  const FormItem = ({ icon, label, ...props }: any) => (
    <div className="space-y-2 flex flex-col group relative">
       <label className="text-[12px] font-black text-gray-500 uppercase tracking-widest ml-1 pointer-events-none group-focus-within:text-indigo-600 transition-colors">{label}</label>
       <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-all duration-300">
             <Icon icon={icon} className="text-xl" />
          </div>
          {props.type === "select" ? (
             <select {...props} className={`${inputBase} appearance-none pr-10 hover:shadow-md cursor-pointer`}>
                {props.options.map((o: any) => <option key={o} value={o}>{o}</option>)}
             </select>
          ) : props.type === "textarea" ? (
             <textarea {...props} className={`${inputBase} px-5 resize-none h-28 pt-4`} />
          ) : props.type === "file" ? (
             <div className="relative cursor-pointer group/file">
                <input {...props} className={`${inputBase} opacity-0 absolute inset-0 cursor-pointer z-10`} />
                <div className={`${inputBase} flex items-center text-gray-400 group-hover/file:border-indigo-400 group-hover/file:bg-indigo-50/20 transition-all`}>
                   {props.file ? (
                     <span className="text-indigo-600 font-black truncate">{props.file.name}</span>
                   ) : (
                     "Tap to capture/upload"
                   )}
                </div>
                {props.file && (
                   <Icon icon="solar:check-circle-bold" className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 text-xl" />
                )}
             </div>
          ) : (
             <input {...props} className={inputBase} />
          )}
          {props.type === "select" && (
             <Icon icon="solar:alt-arrow-down-bold" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          )}
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col lg:flex-row overflow-hidden font-public-sans selection:bg-indigo-100">
      
      {/* Photo Cropper Modal Overlay */}
      {isCropping && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">
           <div className="flex-1 relative">
              <Cropper
                image={imageSrc || ""}
                crop={crop}
                zoom={zoom}
                aspect={4/5} // Passport size aspect ratio (approx 3.5:4.5)
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="rect"
                showGrid={true}
              />
           </div>
           <div className="h-40 bg-zinc-900 border-t border-white/10 p-8 flex flex-col items-center gap-6">
              <div className="w-full max-w-sm">
                 <input 
                    type="range" value={zoom} min={1} max={3} step={0.1} 
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/20 rounded-full appearance-none accent-indigo-500"
                 />
              </div>
              <div className="flex gap-4">
                 <button onClick={() => { setIsCropping(false); setImageSrc(null); }} className="px-8 py-3 rounded-full text-white font-black hover:bg-white/10 transition-all">Cancel</button>
                 <button onClick={handleApplyCrop} className="px-12 py-3 bg-indigo-600 rounded-full text-white font-black shadow-2xl shadow-indigo-500/40 active:scale-95 transition-all">Set Passport Photo</button>
              </div>
           </div>
        </div>
      )}

      {/* Corporate Sidebar */}
      <div className="hidden lg:flex lg:w-[420px] bg-indigo-600 p-16 flex-col justify-between relative overflow-hidden text-white shrink-0 border-r border-indigo-500 shadow-2xl">
         <div className="relative z-10">
            <Link href="/" className="group inline-flex flex-col items-center">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                  <span className="text-indigo-600 text-3xl font-black italic">L</span>
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Virtual SMS</p>
            </Link>
            
            <h2 className="text-5xl font-black leading-[1.05] tracking-tight mt-12 mb-8 italic uppercase text-indigo-50 drop-shadow-sm">
               New Member <br /> 
               <span className="text-indigo-400 bg-white/10 px-2 rounded-lg not-italic">Onboarding</span>
            </h2>
            <p className="text-indigo-100 text-lg font-medium leading-relaxed max-w-[300px] opacity-80">
               Complete your digital profile to join our premium learning spaces.
            </p>
         </div>

         <div className="relative z-10 flex flex-col gap-6">
            {[
               { icon: "solar:rocket-bold-duotone", t: "Express Pass", s: "Approval in 24 hours" },
               { icon: "solar:shield-keyhole-bold-duotone", t: "Private Vault", s: "Data handled with secrecy" },
               { icon: "solar:star-rainbow-bold-duotone", t: "Premium Perks", s: "Access 24/7 silent zones" }
            ].map((f, i) => (
               <div key={i} className="flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center transition-all group-hover:bg-indigo-500 group-hover:scale-105 shadow-inner">
                     <Icon icon={f.icon} className="text-2xl" />
                  </div>
                  <div>
                     <p className="font-black tracking-tight text-white/90">{f.t}</p>
                     <p className="text-indigo-200 text-xs font-semibold">{f.s}</p>
                  </div>
               </div>
            ))}
            <div className="pt-12 flex items-center gap-4 border-t border-indigo-500 mt-6">
               <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">Live Registration Active</p>
            </div>
         </div>

         {/* Backdrop Art */}
         <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-[140px]" />
         <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-black opacity-10 rounded-full blur-[100px]" />
      </div>

      {/* Optimized Form Workflow */}
      <div className="flex-1 overflow-y-auto px-6 py-12 lg:px-24 lg:py-20 flex flex-col bg-white">
         <div className="max-w-3xl mx-auto w-full">
            
            {/* Modular Stepper Navigation */}
            <Stepper 
              steps={steps} 
              currentStep={step} 
              className="mb-20 scale-110" 
              activeColor="bg-indigo-600" 
              progressColor="bg-indigo-500" 
            />

            <form onSubmit={handleSubmit} className="pb-24">
               {/* Step 1: Personal Profile */}
               <InputCard icon="solar:document-text-bold-duotone" label="Identity Details" active={step === 1}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <FormItem 
                        label="Member Name" icon="solar:user-bold-duotone" required
                        placeholder="Ex: David Miller"
                        value={formData.name}
                        onChange={(e: any) => setFormData({...formData, name: e.target.value})}
                     />
                     <FormItem 
                        label="Email Sync" icon="solar:letter-bold-duotone" required
                        placeholder="hello@example.com"
                        value={formData.email}
                        onChange={(e: any) => setFormData({...formData, email: e.target.value})}
                     />
                     <FormItem 
                        label="Father's Full Name" icon="solar:users-group-two-rounded-bold-duotone" required
                        value={formData.fatherName}
                        onChange={(e: any) => setFormData({...formData, fatherName: e.target.value})}
                     />
                     <FormItem 
                        label="Mother's Full Name" icon="solar:heart-bold-duotone" required
                        value={formData.motherName}
                        onChange={(e: any) => setFormData({...formData, motherName: e.target.value})}
                     />
                     <FormItem 
                        label="Birthday" icon="solar:calendar-bold-duotone" required
                        type="date"
                        value={formData.dob}
                        onChange={(e: any) => setFormData({...formData, dob: e.target.value})}
                     />
                     <FormItem 
                        label="Biological Gender" icon="solar:mirror-bold-duotone" required
                        type="select" options={["Male", "Female", "Other"]}
                        value={formData.gender}
                        onChange={(e: any) => setFormData({...formData, gender: e.target.value})}
                     />
                  </div>
                  <div className="flex justify-end pt-12">
                     <button type="button" onClick={() => setStep(2)} className="h-16 px-14 bg-indigo-600 text-white font-black rounded-3xl shadow-2xl shadow-indigo-100 flex items-center gap-3 active:scale-95 hover:bg-indigo-700 transition-all text-sm uppercase tracking-widest">
                        Proceed To Contact <Icon icon="solar:round-alt-arrow-right-bold-duotone" className="text-2xl" />
                     </button>
                  </div>
               </InputCard>

               {/* Step 2: Contact Matrix */}
               <InputCard icon="solar:phone-bold-duotone" label="Communication" active={step === 2}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <FormItem 
                        label="Active Mobile" icon="solar:iphone-bold-duotone" required
                        placeholder="+91-XXXX-XXXXXX"
                        value={formData.number}
                        onChange={(e: any) => setFormData({...formData, number: e.target.value})}
                     />
                     <FormItem 
                        label="Emergency Contact" icon="solar:shield-warning-bold-duotone"
                        placeholder="Family member number"
                        value={formData.secondaryNumber}
                        onChange={(e: any) => setFormData({...formData, secondaryNumber: e.target.value})}
                     />
                     <FormItem 
                        label="Aadhar ID" icon="solar:card-2-bold-duotone" required
                        placeholder="12 digit numeric ID"
                        value={formData.adharNumber}
                        onChange={(e: any) => setFormData({...formData, adharNumber: e.target.value})}
                     />
                     <FormItem 
                        label="Social Background" icon="solar:ranking-bold-duotone" required
                        type="select" options={["General", "OBC", "SC", "ST"]}
                        value={formData.category}
                        onChange={(e: any) => setFormData({...formData, category: e.target.value})}
                     />
                  </div>
                  <div className="flex justify-between pt-14">
                     <button type="button" onClick={() => setStep(1)} className="font-black text-gray-400 hover:text-gray-900 transition-all uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 group">
                        <Icon icon="solar:round-alt-arrow-left-bold-duotone" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Previous
                     </button>
                     <button type="button" onClick={() => setStep(3)} className="h-16 px-14 bg-indigo-600 text-white font-black rounded-3xl shadow-2xl shadow-indigo-100 flex items-center gap-3 active:scale-95 transition-all text-sm uppercase tracking-widest">
                        Location Details <Icon icon="solar:round-alt-arrow-right-bold-duotone" className="text-2xl" />
                     </button>
                  </div>
               </InputCard>

               {/* Step 3: Geography */}
               <InputCard icon="solar:home-bold-duotone" label="Residential Address" active={step === 3}>
                  <div className="space-y-8">
                     <FormItem 
                        label="House No / Street / Landmark" icon="solar:map-point-bold-duotone" required
                        type="textarea"
                        placeholder="Enter your complete home address..."
                        value={formData.address.detailedAddress}
                        onChange={(e: any) => setFormData({...formData, address: {...formData.address, detailedAddress: e.target.value}})}
                     />
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <FormItem label="Tehsil" icon="solar:city-bold-duotone" value={formData.address.tehsil} onChange={(e: any) => setFormData({...formData, address: {...formData.address, tehsil: e.target.value}})} />
                        <FormItem label="District" icon="solar:map-bold-duotone" value={formData.address.district} onChange={(e: any) => setFormData({...formData, address: {...formData.address, district: e.target.value}})} />
                        <FormItem label="State" icon="solar:globus-bold-duotone" value={formData.address.state} onChange={(e: any) => setFormData({...formData, address: {...formData.address, state: e.target.value}})} />
                        <FormItem label="Zip / Pincode" icon="solar:mailbox-bold-duotone" value={formData.address.pincode} onChange={(e: any) => setFormData({...formData, address: {...formData.address, pincode: e.target.value}})} />
                     </div>
                  </div>
                  <div className="flex justify-between pt-14">
                     <button type="button" onClick={() => setStep(2)} className="font-black text-gray-400 hover:text-gray-900 transition-all uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 group">
                        <Icon icon="solar:round-alt-arrow-left-bold-duotone" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Address Back
                     </button>
                     <button type="button" onClick={() => setStep(4)} className="h-16 px-14 bg-indigo-600 text-white font-black rounded-3xl shadow-2xl shadow-indigo-100 flex items-center gap-3 active:scale-95 transition-all text-sm uppercase tracking-widest">
                        Verify Documents <Icon icon="solar:round-alt-arrow-right-bold-duotone" className="text-2xl" />
                     </button>
                  </div>
               </InputCard>

               {/* Step 4: Digital Assets */}
               <InputCard icon="solar:camera-bold-duotone" label="Media Identity" active={step === 4}>
                  <div className="space-y-8">
                     <FormItem 
                        label="Academic Goal / Course" icon="solar:notebook-bold-duotone"
                        placeholder="Ex: UPSC Preparation, Engineering, etc."
                        value={formData.course}
                        onChange={(e: any) => setFormData({...formData, course: e.target.value})}
                     />
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                           <FormItem 
                             label="Passport Size Photo" icon="solar:upload-bold-duotone" type="file" 
                             file={formData.photo}
                             onChange={(e: any) => handleFileChange(e, "photo")} 
                           />
                           <p className="text-[10px] font-bold text-indigo-500 mt-2 italic px-1">* Post-upload cropping will open automatically</p>
                        </div>
                        <FormItem 
                          label="Digital Signature" icon="solar:pen-new-square-bold-duotone" type="file" 
                          file={formData.signature}
                          onChange={(e: any) => handleFileChange(e, "signature")} 
                        />
                     </div>
                     
                     {/* Preview Previews */}
                     {(formData.photo || formData.signature) && (
                        <div className="flex gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
                           {formData.photo && (
                              <div className="flex flex-col items-center gap-2">
                                 <div className="w-20 h-24 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                    <img src={URL.createObjectURL(formData.photo)} className="w-full h-full object-cover" />
                                 </div>
                                 <span className="text-[8px] font-black uppercase text-gray-400">Cropped Photo</span>
                              </div>
                           )}
                           {formData.signature && (
                              <div className="flex flex-col items-center gap-2">
                                 <div className="w-40 h-24 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm flex items-center justify-center p-2">
                                    <img src={URL.createObjectURL(formData.signature)} className="max-w-full max-h-full object-contain" />
                                 </div>
                                 <span className="text-[8px] font-black uppercase text-gray-400">Signature</span>
                              </div>
                           )}
                        </div>
                     )}
                  </div>
                  <div className="flex justify-between pt-14">
                     <button type="button" onClick={() => setStep(3)} className="font-black text-gray-400 hover:text-gray-900 transition-all uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 group">
                        <Icon icon="solar:round-alt-arrow-left-bold-duotone" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Media Back
                     </button>
                     <button type="button" onClick={() => setStep(5)} className="h-16 px-14 bg-emerald-500 text-white font-black rounded-3xl shadow-2xl shadow-emerald-100 flex items-center gap-3 active:scale-95 transition-all text-sm uppercase tracking-widest">
                        Review Profile <Icon icon="solar:eye-bold-duotone" className="text-2xl" />
                     </button>
                  </div>
               </InputCard>

               {/* Step 5: Master Review */}
               <InputCard icon="solar:verified-check-bold-duotone" label="Quality Control" active={step === 5}>
                  <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 -mr-16 -mt-16 rounded-full" />
                     <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray-50 -ml-16 -mb-16 rounded-full opacity-50" />

                     {[
                        { icon: "solar:user-bold", l: "Full Name", v: formData.name },
                        { icon: "solar:letter-bold", l: "Email Address", v: formData.email },
                        { icon: "solar:iphone-bold", l: "Mobile Number", v: formData.number },
                        { icon: "solar:calendar-bold", l: "Date of Birth", v: formData.dob },
                        { icon: "solar:card-2-bold", l: "Aadhar Data", v: formData.adharNumber },
                        { icon: "solar:notebook-bold", l: "Applied Course", v: formData.course || "Open Study" }
                     ].map((item, i) => (
                        <div key={i} className="flex gap-4 group/rev items-start">
                           <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-transparent group-hover/rev:bg-indigo-50 group-hover/rev:text-indigo-600 group-hover/rev:border-indigo-100 transition-all">
                              <Icon icon={item.icon} className="text-lg" />
                           </div>
                           <div className="flex flex-col gap-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">{item.l}</p>
                              <p className="font-black text-gray-900 tracking-tight text-base truncate max-w-[180px]">{item.v || "---"}</p>
                           </div>
                        </div>
                     ))}
                     <div className="sm:col-span-2 pt-8 border-t border-gray-100 relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                           <Icon icon="solar:map-point-bold-duotone" className="text-indigo-500 text-lg" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verified Address</p>
                        </div>
                        <p className="font-semibold text-gray-500 italic leading-relaxed text-sm">
                           {formData.address.detailedAddress}, {formData.address.tehsil}, {formData.address.district}, {formData.address.state} - {formData.address.pincode}
                        </p>
                     </div>
                  </div>
                  <div className="flex justify-between pt-16 items-center flex-col sm:flex-row gap-8">
                     <button type="button" onClick={() => setStep(4)} className="font-black text-gray-400 hover:text-gray-900 transition-all uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 group order-2 sm:order-1">
                        <Icon icon="solar:round-alt-arrow-left-bold-duotone" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Re-Check Media
                     </button>
                     <button type="submit" className="w-full sm:w-auto h-20 px-20 bg-indigo-600 text-white font-black rounded-3xl shadow-2xl shadow-indigo-200 flex items-center justify-center gap-4 active:scale-95 transition-all text-sm uppercase tracking-[0.1em] order-1 sm:order-2">
                        Initialize ID
                        <Icon icon="solar:magic-stick-3-bold-duotone" className="text-3xl animate-pulse" />
                     </button>
                  </div>
               </InputCard>
            </form>
         </div>
      </div>
    </div>
  );
}
