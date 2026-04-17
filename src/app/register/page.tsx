"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import Link from "next/link";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import { Stepper, Step } from "@/components/shared/Stepper";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/shared/Button";

const inputBase = "w-full text-sm px-6 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none text-gray-700 placeholder:text-gray-400 font-medium placeholder:font-normal shadow-sm group-hover:border-indigo-200";

const slides = [
  {
    image: "/login-bg.png",
    title: "Silent Study Zones",
    description: "Experience 24/7 access to premium, distraction-free environments with high-speed internet and ergonomic seating.",
    icon: "solar:leaf-bold-duotone"
  },
  {
    image: "/loginSide.png",
    title: "Digital Ecosystem",
    description: "Instant access to a vast collection of e-books, research journals, and advanced computerized study stations.",
    icon: "solar:laptop-bold-duotone"
  }
];

function SectionHeader({
  step, title, sub, color,
}: { step: string; title: string; sub: string; color: string }) {
  return (
    <div className="flex items-center gap-4 mb-8 bg-gray-50 p-2 rounded-2xl border border-gray-100/50">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center font-black text-sm shadow-sm`}>
        {step}
      </div>
      <div>
        <h3 className="text-base font-black text-gray-900 tracking-tight leading-none mb-1">{title}</h3>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{sub}</p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [registeredId, setRegisteredId] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  
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

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, []);

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
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-public-sans selection:bg-indigo-100">
        <div className="max-w-xl w-full text-center flex flex-col items-center bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-700">
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
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-2">Member Reference ID</p>
             <p className="text-4xl font-black text-gray-900 tracking-widest uppercase italic mb-8 select-all decoration-indigo-200 decoration-8 underline-offset-[10px] underline">{registeredId.slice(-8)}</p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full relative z-10">
                <Link 
                   href={`/status/${registeredId}`} 
                   className="flex items-center justify-center gap-3 bg-indigo-600 text-white font-black py-4.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 text-sm"
                >
                   Track Status <Icon icon="solar:map-point-wave-bold-duotone" className="text-xl" />
                </Link>
                <button 
                   onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/status/${registeredId}`);
                      toast.success("Link Copied!");
                   }}
                   className="flex items-center justify-center gap-3 bg-white border border-gray-100 text-gray-900 font-black py-4.5 rounded-2xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 text-sm"
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

  const InputCard = ({ active, stepNumber, title, sub, color, children }: any) => (
    <div className={`animate-in duration-500 ${active ? "slide-in-from-right-8 opacity-100" : "opacity-0 hidden"}`}>
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 ring-1 ring-gray-100/50">
            <SectionHeader
                step={stepNumber}
                title={title}
                sub={sub}
                color={color}
            />
            {children}
        </div>
    </div>
  );

  const FormItem = ({ icon, label, ...props }: any) => (
    <div className="space-y-2 flex flex-col group relative">
       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 pointer-events-none group-focus-within:text-indigo-600 transition-colors uppercase leading-none">{label}</label>
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
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 lg:p-12 font-public-sans selection:bg-indigo-100 overflow-x-hidden">
      
      {/* Photo Cropper Modal Overlay */}
      {isCropping && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">
           <div className="flex-1 relative">
              <Cropper
                image={imageSrc || ""}
                crop={crop}
                zoom={zoom}
                aspect={4/5} 
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
                 <button onClick={handleApplyCrop} className="px-12 py-3 bg-indigo-600 rounded-full text-white font-black shadow-2xl shadow-indigo-500/40 active:scale-95 transition-all">Set Crop</button>
              </div>
           </div>
        </div>
      )}

      {/* Main Card Container */}
      <div className="max-w-7xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[850px] border border-white">
        
        {/* Left Side: Modern Slider */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden group/slider border-r border-gray-50">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1.05 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: "circOut" }}
                className="absolute inset-0"
              >
                 <img src={slides[activeSlide].image} className="w-full h-full object-cover" alt="Slide" />
                 
                 {/* Glass Overlay Content */}
                 <div className="absolute inset-x-0 bottom-0 p-10 pt-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="p-8 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">
                       <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                          <Icon icon={slides[activeSlide].icon} className="text-white text-2xl" />
                       </div>
                       <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-4">{slides[activeSlide].title}</h3>
                       <p className="text-white/80 font-medium leading-relaxed italic text-sm">
                          {slides[activeSlide].description}
                       </p>
                    </div>
                 </div>
              </motion.div>
           </AnimatePresence>

           {/* Reusable Slider Nav Buttons */}
           <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-6 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
              >
                 <Icon icon="solar:round-alt-arrow-left-bold" className="text-2xl" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
              >
                 <Icon icon="solar:round-alt-arrow-right-bold" className="text-2xl" />
              </button>
           </div>
        </div>

        {/* Right Side: Form Workflow */}
        <div className="lg:w-1/2 flex flex-col relative z-10 bg-white overflow-hidden">
           {/* Fixed Header */}
           <div className="px-6 py-10 lg:px-14 bg-white border-b border-gray-50 flex items-center justify-between shrink-0">
               <div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase leading-none mb-1">Onboarding</h1>
                  <p className="text-[10px] font-black text-indigo-500 italic uppercase tracking-[0.2em]">New Member Registration</p>
               </div>
               <Link href="/login" className="px-6 py-2.5 bg-gray-50 rounded-xl text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-2">
                  Already Member? <Icon icon="solar:round-alt-arrow-right-bold" className="text-sm" />
               </Link>
           </div>

           {/* Scrollable Content */}
           <div className="flex-1 overflow-y-auto px-6 py-10 lg:px-14 lg:py-12 custom-scrollbar">
              <div className="max-w-2xl mx-auto w-full">
                {/* Modular Stepper Navigation */}
                <Stepper 
                  steps={steps} 
                  currentStep={step} 
                  className="mb-14 scale-105" 
                  activeColor="bg-indigo-600" 
                  progressColor="bg-indigo-600" 
                />

                <form onSubmit={handleSubmit} className="pb-10">
                   {/* Step 1: Personal Profile */}
                   <InputCard 
                      active={step === 1} 
                      stepNumber="01" 
                      title="Personal Identity" 
                      sub="Basic background credentials"
                      color="bg-indigo-100 text-indigo-600"
                   >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                         <FormItem 
                            label="Full Name" icon="solar:user-bold-duotone" required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e: any) => setFormData({...formData, name: e.target.value})}
                         />
                         <FormItem 
                            label="Email Address" icon="solar:letter-bold-duotone" required
                            placeholder="user@example.com"
                            value={formData.email}
                            onChange={(e: any) => setFormData({...formData, email: e.target.value})}
                         />
                         <FormItem 
                            label="Father's Name" icon="solar:users-group-two-rounded-bold-duotone" required
                            value={formData.fatherName}
                            onChange={(e: any) => setFormData({...formData, fatherName: e.target.value})}
                         />
                         <FormItem 
                            label="Mother's Name" icon="solar:heart-bold-duotone" required
                            value={formData.motherName}
                            onChange={(e: any) => setFormData({...formData, motherName: e.target.value})}
                         />
                         <FormItem 
                            label="Date of Birth" icon="solar:calendar-bold-duotone" required
                            type="date"
                            value={formData.dob}
                            onChange={(e: any) => setFormData({...formData, dob: e.target.value})}
                         />
                         <FormItem 
                            label="Gender" icon="solar:mirror-bold-duotone" required
                            type="select" options={["Male", "Female", "Other"]}
                            value={formData.gender}
                            onChange={(e: any) => setFormData({...formData, gender: e.target.value})}
                         />
                      </div>
                      <div className="flex justify-end pt-12">
                         <Button 
                           onClick={() => setStep(2)} 
                           variant="primary"
                           icon="solar:round-alt-arrow-right-bold-duotone"
                           iconPosition="right"
                           className="h-16 px-14 rounded-[2rem] shadow-2xl shadow-indigo-100 uppercase tracking-widest text-xs font-black"
                         >
                            Next Stage
                         </Button>
                      </div>
                   </InputCard>

                   {/* Step 2: Contact Matrix */}
                   <InputCard 
                      active={step === 2} 
                      stepNumber="02" 
                      title="Contact Matrix" 
                      sub="Communication & reachability"
                      color="bg-emerald-100 text-emerald-600"
                   >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                         <FormItem 
                            label="Primary Mobile" icon="solar:iphone-bold-duotone" required
                            placeholder="+91-00000-00000"
                            value={formData.number}
                            onChange={(e: any) => setFormData({...formData, number: e.target.value})}
                         />
                         <FormItem 
                            label="Alt Number" icon="solar:phone-bold-duotone"
                            value={formData.secondaryNumber}
                            onChange={(e: any) => setFormData({...formData, secondaryNumber: e.target.value})}
                         />
                         <FormItem 
                            label="Aadhar Number" icon="solar:card-2-bold-duotone" required
                            value={formData.adharNumber}
                            onChange={(e: any) => setFormData({...formData, adharNumber: e.target.value})}
                         />
                         <FormItem 
                            label="Category" icon="solar:ranking-bold-duotone" required
                            type="select" options={["General", "OBC", "SC", "ST"]}
                            value={formData.category}
                            onChange={(e: any) => setFormData({...formData, category: e.target.value})}
                         />
                      </div>
                      <div className="flex justify-between pt-14 items-center">
                         <Button 
                           onClick={() => setStep(1)} 
                           variant="ghost"
                           className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em]"
                         >
                            Modified Back
                         </Button>
                         <Button 
                           onClick={() => setStep(3)} 
                           variant="primary"
                           icon="solar:round-alt-arrow-right-bold-duotone"
                           iconPosition="right"
                           className="h-16 px-14 rounded-[2rem] shadow-2xl shadow-indigo-100 uppercase tracking-widest text-xs font-black"
                         >
                            Location Info
                         </Button>
                      </div>
                   </InputCard>

                   {/* Step 3: Geography */}
                   <InputCard 
                      active={step === 3} 
                      stepNumber="03" 
                      title="Resident Address" 
                      sub="Physical location details"
                      color="bg-amber-100 text-amber-600"
                   >
                      <div className="space-y-6">
                         <FormItem 
                            label="House No / Street" icon="solar:map-point-bold-duotone" required
                            type="textarea"
                            value={formData.address.detailedAddress}
                            onChange={(e: any) => setFormData({...formData, address: {...formData.address, detailedAddress: e.target.value}})}
                         />
                         <div className="grid grid-cols-2 gap-6">
                            <FormItem label="Tehsil" icon="solar:city-bold-duotone" value={formData.address.tehsil} onChange={(e: any) => setFormData({...formData, address: {...formData.address, tehsil: e.target.value}})} />
                            <FormItem label="District" icon="solar:map-bold-duotone" value={formData.address.district} onChange={(e: any) => setFormData({...formData, address: {...formData.address, district: e.target.value}})} />
                            <FormItem label="State" icon="solar:globus-bold-duotone" value={formData.address.state} onChange={(e: any) => setFormData({...formData, address: {...formData.address, state: e.target.value}})} />
                            <FormItem label="Pincode" icon="solar:mailbox-bold-duotone" value={formData.address.pincode} onChange={(e: any) => setFormData({...formData, address: {...formData.address, pincode: e.target.value}})} />
                         </div>
                      </div>
                      <div className="flex justify-between pt-14 items-center">
                         <Button 
                           onClick={() => setStep(2)} 
                           variant="ghost"
                           className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em]"
                         >
                            Address Back
                         </Button>
                         <Button 
                           onClick={() => setStep(4)} 
                           variant="primary"
                           icon="solar:round-alt-arrow-right-bold-duotone"
                           iconPosition="right"
                           className="h-16 px-14 rounded-[2rem] shadow-2xl shadow-indigo-100 uppercase tracking-widest text-xs font-black"
                         >
                            Digital Matrix
                         </Button>
                      </div>
                   </InputCard>

                   {/* Step 4: Digital Assets */}
                   <InputCard 
                      active={step === 4} 
                      stepNumber="04" 
                      title="Digital Media" 
                      sub="Photo & Signature registry"
                      color="bg-pink-100 text-pink-600"
                   >
                      <div className="space-y-6">
                         <FormItem 
                            label="Target Course" icon="solar:notebook-bold-duotone"
                            placeholder="Ex: UPSC, GATE, etc."
                            value={formData.course}
                            onChange={(e: any) => setFormData({...formData, course: e.target.value})}
                         />
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                               <FormItem 
                                 label="Member Photo" icon="solar:upload-bold-duotone" type="file" 
                                 file={formData.photo}
                                 onChange={(e: any) => handleFileChange(e, "photo")} 
                               />
                               <p className="text-[10px] font-black text-indigo-500 mt-2 italic px-1">* Auto-cropping active</p>
                            </div>
                            <FormItem 
                              label="Member Sign" icon="solar:pen-new-square-bold-duotone" type="file" 
                              file={formData.signature}
                              onChange={(e: any) => handleFileChange(e, "signature")} 
                            />
                         </div>
                      </div>
                      <div className="flex justify-between pt-14 items-center">
                         <Button 
                           onClick={() => setStep(3)} 
                           variant="ghost"
                           className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em]"
                         >
                            Back to Geo
                         </Button>
                         <Button 
                           onClick={() => setStep(5)} 
                           variant="primary"
                           color="#10b981"
                           icon="solar:eye-bold-duotone"
                           iconPosition="right"
                           className="h-16 px-14 rounded-[2rem] shadow-2xl shadow-emerald-100 uppercase tracking-widest text-xs font-black"
                         >
                            Review Matrix
                         </Button>
                      </div>
                   </InputCard>

                   {/* Step 5: Master Review */}
                   <InputCard 
                      active={step === 5} 
                      stepNumber="05" 
                      title="Master Review" 
                      sub="Quality control check"
                      color="bg-indigo-600 text-white"
                   >
                      <div className="bg-gray-50 rounded-[2rem] border border-gray-100 p-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 relative overflow-hidden italic font-medium">
                         {[
                            { icon: "solar:user-bold", l: "Full Name", v: formData.name },
                            { icon: "solar:letter-bold", l: "Registry Email", v: formData.email },
                            { icon: "solar:iphone-bold", l: "Active Mobile", v: formData.number },
                            { icon: "solar:card-2-bold", l: "Aadhar ID", v: formData.adharNumber },
                         ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-1">
                               <div className="flex items-center gap-2 mb-1">
                                  <Icon icon={item.icon} className="text-gray-400 text-sm" />
                                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-none">{item.l}</p>
                               </div>
                               <p className="font-black text-gray-900 tracking-tight text-sm truncate uppercase">{item.v || "---"}</p>
                            </div>
                         ))}
                      </div>
                      <div className="flex justify-between pt-14 items-center flex-col sm:flex-row gap-8">
                         <Button 
                           onClick={() => setStep(4)} 
                           variant="ghost"
                           className="font-black text-gray-400 hover:text-gray-900 uppercase text-[10px] tracking-[0.2em] order-2 sm:order-1"
                         >
                            Back to Media
                         </Button>
                         <Button 
                           type="submit" 
                           variant="primary"
                           icon="solar:verified-check-bold-duotone"
                           iconPosition="right"
                           className="w-full sm:w-auto h-20 px-20 rounded-[2.5rem] shadow-2xl shadow-indigo-200 uppercase tracking-[0.15em] text-xs font-black order-1 sm:order-2"
                         >
                            Submit Registry
                         </Button>
                      </div>
                   </InputCard>
                </form>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
