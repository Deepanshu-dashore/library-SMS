"use client";

import React, { useState, useCallback, useRef } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import { motion, AnimatePresence } from "framer-motion";
import "./register.css";

// --- Sub-components (Moved outside to prevent focus loss) ---

const StepItem = ({ id, title, active, completed }: { id: number; title: string; active: boolean; completed: boolean }) => (
  <div className={`step-item ${active ? "active" : ""} ${completed ? "completed" : ""}`}>
    <div className="step-number">{completed ? <Icon icon="solar:check-read-bold" /> : id}</div>
    <span className="step-title">{title}</span>
  </div>
);

const FormField = ({ label, icon, options, type, required, ...props }: any) => (
  <div className="form-field">
    <label className="field-label">
      {label}
      {required && <span className="text-red-500 font-bold ml-1">*</span>}
    </label>
    <div className="input-wrapper">
      {type === "select" ? (
        <>
          <select {...props} className={`custom-input appearance-none ${props.disabled ? 'bg-gray-50 cursor-not-allowed opacity-75' : ''}`}>
            <option value="" disabled>Select {label}</option>
            {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
          </select>
          <Icon icon="solar:alt-arrow-down-bold" className="input-icon" />
        </>
      ) : type === "textarea" ? (
        <textarea {...props} className={`custom-input min-h-[100px] resize-none ${props.disabled ? 'bg-gray-50 cursor-not-allowed opacity-75' : ''}`} />
      ) : type === "date" ? (
        <>
          <input {...props} type="date" className={`custom-input ${props.disabled ? 'bg-gray-50 cursor-not-allowed opacity-75' : ''}`} />
          <Icon icon="solar:calendar-bold" className="input-icon" />
        </>
      ) : (
        <input {...props} className={`custom-input ${props.disabled ? 'bg-gray-50 cursor-not-allowed opacity-75' : ''}`} />
      )}
    </div>
  </div>
);

const UploadZone = ({ field, label, hint, preview, inputRef, icon, required, removeFile, handleFileChange, disabled }: any) => (
  <div className="flex flex-col gap-4">
    <label className="field-label">
      {label}
      {required && <span className="text-red-500 font-bold ml-1">*</span>}
    </label>
    {preview ? (
      <div className={`preview-box ${field === 'signature' ? 'signature' : ''} ${disabled ? 'opacity-90 grayscale-[0.2]' : ''}`}>
        <img src={preview} alt={label} className="preview-image" />
        {!disabled && (
          <button type="button" onClick={() => removeFile(field)} className="remove-btn">
            <Icon icon="solar:trash-bin-trash-bold" />
          </button>
        )}
      </div>
    ) : (
      <div className={`upload-zone ${disabled ? 'opacity-50 pointer-events-none' : ''}`} onClick={() => !disabled && inputRef.current?.click()}>
        <div className="upload-icon-box">
          <Icon icon={icon} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="upload-text">Click to upload {label}</span>
          <span className="upload-hint">{hint}</span>
        </div>
        <input
          type="file" ref={inputRef} className="hidden" accept="image/*"
          onChange={(e) => handleFileChange(e, field)}
        />
      </div>
    )}
  </div>
);

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [registeredId, setRegisteredId] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [declared, setDeclared] = useState(false);
  
  // Status Modal States
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusIdToSearch, setStatusIdToSearch] = useState("");

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
  });

  const [previews, setPreviews] = useState({
    photo: "",
    signature: ""
  });

  const photoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  // --- Validation Logic ---

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) return "Full Name is required";
        if (!formData.gender) return "Gender is required";
        if (!formData.dob) return "Date of Birth is required";
        if (!formData.email.trim()) return "Email is required";
        if (!formData.number.trim()) return "Phone Number is required";
        if (!formData.fatherName.trim()) return "Father's Name is required";
        if (!formData.motherName.trim()) return "Mother's Name is required";
        if (!formData.category) return "Category is required";
        if (!formData.adharNumber.trim()) return "Aadhar Number is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Invalid Email Address";
        if (!/^\d{10}$/.test(formData.number.replace(/\D/g, ""))) return "Phone Number must be 10 digits";
        break;
      case 2:
        if (!formData.address.detailedAddress.trim()) return "Detailed Address is required";
        if (!formData.address.district.trim()) return "District is required";
        if (!formData.address.state.trim()) return "State is required";
        if (!formData.address.pincode.trim()) return "Pincode is required";
        break;
      case 3:
        if (!formData.photo) return "Passport Image is required";
        if (!formData.signature) return "E-Signature is required";
        break;
      default:
        return null;
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(step);
    if (error) {
      toast.error(error);
      return;
    }
    setStep(step + 1);
  };

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
        setPreviews({ ...previews, photo: URL.createObjectURL(croppedImageBlob) });
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
        setPreviews({ ...previews, signature: URL.createObjectURL(file) });
        toast.success("Signature uploaded!");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 4 || isRegistering) return;

    setIsRegistering(true);
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
    } finally {
        setIsRegistering(false);
    }
  };

  const removeFile = (field: "photo" | "signature") => {
      setFormData({ ...formData, [field]: null });
      setPreviews({ ...previews, [field]: "" });
      if (field === "photo" && photoInputRef.current) photoInputRef.current.value = "";
      if (field === "signature" && signatureInputRef.current) signatureInputRef.current.value = "";
  };

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusIdToSearch.trim()) {
        toast.error("Enter a valid Application ID");
        return;
    }
    router.push(`/status/${statusIdToSearch.trim()}`);
  };

  if (submitted && registeredId) {
    return (
      <div className="register-container flex items-center justify-center p-6 bg-[#f8fafc]">
        <main className="w-full max-w-lg">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="bg-white rounded-[44px] p-8 md:p-12 shadow-2xl border border-slate-100 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#98c156] to-indigo-500" />
              
              <div className="w-full h-52 relative mb-10 rounded-3xl overflow-hidden shadow-sm">
                <Image 
                    src="/registrationSucess.jpg" 
                    alt="Success" 
                    fill 
                    className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-2 mb-8 items-center">
                 <div className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                    Application Received
                 </div>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tight">Registration Success!</h1>
                 <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-xs transition-all">
                    Member profile for <span className="text-slate-900 font-bold underline decoration-[#98c156] decoration-2 underline-offset-4">{formData.name}</span> has been successfully submitted.
                 </p>
              </div>
              
              <div className="bg-slate-50/50 rounded-2xl p-6 mb-10 border border-slate-100 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1.5">
                    <Icon icon="solar:hashtag-bold" className="text-slate-300 text-xs" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Application Number</span>
                </div>
                <p className="text-2xl font-black text-slate-800 tracking-wider">#{registeredId.slice(-8).toUpperCase()}</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/status/${registeredId}`); toast.success("Tracking link copied!"); }} 
                  className="flex-1 bg-white border border-slate-200 py-4.5 rounded-2xl text-slate-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all border-b-4 active:border-b-0 active:translate-y-1"
                >
                  <Icon icon="solar:link-bold" /> Copy Link
                </button>
                <Link 
                    href={`/status/${registeredId}`} 
                    className="flex-1 bg-indigo-600 py-4.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1"
                >
                  <Icon icon="solar:bill-list-bold" /> Track Status
                </Link>
              </div>

              <Link href="/" className="inline-flex items-center gap-2 mt-12 text-slate-400 font-bold text-[10px] hover:text-[#98c156] transition-colors uppercase tracking-[0.2em]">
                <Icon icon="solar:home-2-bold" /> Return Home
              </Link>
            </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="register-container bg-gradient-to-bl from-[#dff3f8] via-[var(--card)] to-[rgba(255,241,241,1)] bg-opacity-90 backdrop-blur-md  border-gray-300">

      <header className="register-header">
        <Link href="/" className="flex items-center gap-3 overflow-visible">
          <Image height="100" width="100" alt="Library Management software" src="/LogoWithoutBg.png" className="w-14 h-14 rounded-lg" />
          <div className="flex flex-col font-public-sans">
            <h1 className="text-lg uppercase font-bold leading-tight" style={{ color: "var(--text)" }}>
              Library SMS
            </h1>
            <p className="text-[10px] font-barlow font-semibold capitalize leading-tight" style={{ color: "var(--gray-500)" }}>
              Smart Management System
            </p>
          </div>
          <div className="border-l-4 border-gray-300 pl-3">
               <h1 className="text-2xl capitalize font-semibold">Member&apos;s Registration Form</h1>
               <p className="text-xs text-gray-500">Enter the details to get going</p>
          </div>
        </Link>
        <div className="login-link flex items-center gap-4">
            <button 
                onClick={() => setShowStatusModal(true)}
                className="border cursor-pointer bg-[#98c156] border-slate-200 group text-white px-4 py-2 rounded-lg text-sm hover:text-gray-700 font-medium hover:bg-slate-50 transition-all flex items-center gap-2 shadow-xs"
            >
                <Icon icon="bitcoin-icons:verify-filled" className="text-white text-3xl group-hover:text-gray-700" /> Check Status
            </button>
        </div>
      </header>

      <main className="register-main">
        <div className="max-container">
            <div className="stepper-container">
              <StepItem id={1} title="General Details" active={step === 1} completed={step > 1} />
              <div className={`step-line ${step > 1 ? "completed" : ""}`} />
              <StepItem id={2} title="Residential Info" active={step === 2} completed={step > 2} />
              <div className={`step-line ${step > 2 ? "completed" : ""}`} />
              <StepItem id={3} title="Documents" active={step === 3} completed={step > 3} />
              <div className={`step-line ${step > 3 ? "completed" : ""}`} />
              <StepItem id={4} title="Review & Submit" active={step === 4} completed={step > 4} />
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="form-grid">
                                <FormField label="First Name" required placeholder="Hrithik Rana" value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} />
                                <FormField label="Last Name" placeholder="Enter your Last Name" />
                                <FormField label="Gender" required type="select" options={["Male", "Female", "Other"]} value={formData.gender} onChange={(e: any) => setFormData({...formData, gender: e.target.value})} />
                                <FormField label="Date of Birth" required type="date" value={formData.dob} onChange={(e: any) => setFormData({...formData, dob: e.target.value})} />
                                <FormField label="Email Address" required placeholder="Enter your Email Address" value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} />
                                <FormField label="Phone Number" required placeholder="+919876543210" value={formData.number} onChange={(e: any) => setFormData({...formData, number: e.target.value})} />
                                <FormField label="Father's Name" required value={formData.fatherName} onChange={(e: any) => setFormData({...formData, fatherName: e.target.value})} />
                                <FormField label="Mother's Name" required value={formData.motherName} onChange={(e: any) => setFormData({...formData, motherName: e.target.value})} />
                                <FormField label="Category" required type="select" options={["General", "OBC", "SC", "ST"]} value={formData.category} onChange={(e: any) => setFormData({...formData, category: e.target.value})} />
                                <FormField label="Aadhar Number" required placeholder="12 digit Aadhar" value={formData.adharNumber} onChange={(e: any) => setFormData({...formData, adharNumber: e.target.value})} />
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="form-grid">
                                <div className="md:col-span-2">
                                    <FormField label="Detailed Address" required type="textarea" placeholder="House No, Street, Landmark..." value={formData.address.detailedAddress} onChange={(e: any) => setFormData({...formData, address: {...formData.address, detailedAddress: e.target.value}})} />
                                </div>
                                <FormField label="Tehsil" placeholder="Enter Tehsil" value={formData.address.tehsil} onChange={(e: any) => setFormData({...formData, address: {...formData.address, tehsil: e.target.value}})} />
                                <FormField label="District" required placeholder="Enter District" value={formData.address.district} onChange={(e: any) => setFormData({...formData, address: {...formData.address, district: e.target.value}})} />
                                <FormField label="State" required placeholder="Enter State" value={formData.address.state} onChange={(e: any) => setFormData({...formData, address: {...formData.address, state: e.target.value}})} />
                                <FormField label="Pin Code" required placeholder="Enter your area's Pin Code" value={formData.address.pincode} onChange={(e: any) => setFormData({...formData, address: {...formData.address, pincode: e.target.value}})} />
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="upload-grid">
                                <UploadZone
                                    field="photo" label="Passport Image" icon="material-symbols-light:monochrome-photos" required
                                    hint="JPG, PNG or WEBP. Max 2MB" preview={previews.photo} inputRef={photoInputRef}
                                    removeFile={removeFile} handleFileChange={handleFileChange}
                                />
                                <UploadZone
                                    field="signature" label="E-Signature" icon="streamline-freehand:cash-payment-pen-signature" required
                                    hint="Sign on white paper and upload" preview={previews.signature} inputRef={signatureInputRef}
                                    removeFile={removeFile} handleFileChange={handleFileChange}
                                />
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="form-grid">
                                <FormField label="Full Name" value={formData.name} disabled />
                                <FormField label="Email" value={formData.email} disabled />
                                <FormField label="Phone" value={formData.number} disabled />
                                <FormField label="Aadhar" value={formData.adharNumber} disabled />
                                <div className="md:col-span-2">
                                    <FormField label="Detailed Address" value={formData.address.detailedAddress} disabled type="textarea" />
                                </div>
                                <div className="md:col-span-2 flex gap-6 mt-4">
                                     <div className="flex-1">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Photo</p>
                                        <UploadZone preview={previews.photo} disabled field="photo" />
                                     </div>
                                     <div className="flex-1">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Signature</p>
                                        <UploadZone preview={previews.signature} disabled field="signature" />
                                     </div>
                                </div>
                                <div className="md:col-span-2 mt-8">
                                     <label className={`flex items-start gap-4 p-5 rounded-2x border transition-all cursor-pointer ${declared ? 'bg-green-50 border-green-100 shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-slate-100/50'}`}>
                                         <input 
                                             type="checkbox" 
                                             checked={declared}
                                             onChange={(e) => setDeclared(e.target.checked)}
                                             className="w-5 h-5 mt-0.5 rounded border-slate-300 text-[#98c156] focus:ring-[#98c156] accent-[#98c156]"
                                         />
                                         <span className={`text-[13px] font-bold leading-relaxed ${declared ? 'text-green-700' : 'text-slate-500'}`}>
                                            I hereby declare that I have taken admission in Shri Sanwariya Library and I will pay the monthly fees on time. I will follow all the rules and regulations of the library.
                                         </span>
                                     </label>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="nav-buttons">
                        {step > 1 ? (
                            <button type="button" onClick={() => setStep(step - 1)} className="btn-back" disabled={isRegistering}>
                                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24">
	<path fill="currentColor"  fillRule="evenodd" d="M16.207 4.293a1 1 0 0 1 0 1.414L9.914 12l6.293 6.293a1 1 0 0 1-1.414 1.414L8.5 13.414a2 2 0 0 1 0-2.828l6.293-6.293a1 1 0 0 1 1.414 0" clipRule="evenodd"></path>
</svg> Back
                            </button>
                        ) : <div />}
                        
                        <button
                            type={step === 4 ? "submit" : "button"}
                            onClick={step === 4 ? undefined : handleNext}
                            className={`btn-next ${(isRegistering || (step === 4 && !declared)) ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={isRegistering || (step === 4 && !declared)}
                        >
                            {isRegistering ? (
                                <>
                                    <Icon icon="line-md:loading-twotone-loop" className="mr-2" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {step === 4 ? "Register Now" : "Next"}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="rotate-180 ml-2" width={18} height={18} viewBox="0 0 24 24">
	<path fill="currentColor"  fillRule="evenodd" d="M16.207 4.293a1 1 0 0 1 0 1.414L9.914 12l6.293 6.293a1 1 0 0 1-1.414 1.414L8.5 13.414a2 2 0 0 1 0-2.828l6.293-6.293a1 1 0 0 1 1.414 0" clipRule="evenodd"></path>
</svg>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </main>

      {/* --- Modals Section --- */}

      {/* Status Lookup Modal */}
      <AnimatePresence>
        {showStatusModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="modal-backdrop flex items-center justify-center p-6 z-[999]"
          >
            <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 10 }}
                className="bg-white rounded-xl p-8 md:p-12 max-w-sm w-full shadow-2xl relative"
            >
                <button onClick={() => setShowStatusModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 transition-colors">
                    <Icon icon="solar:close-circle-bold" className="text-xl" />
                </button>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Check Application</h2>
                <p className="text-slate-600 text-sm font-semibold leading-relaxed mb-10">
                    Enter your unique Application ID to see the current status of your registration.
                </p>

                <form onSubmit={handleCheckStatus} className="w-full">
                    <div className="mb-10">
                        <label className="text-xs font-semibold capitalize text-slate-700 block mb-3">Your Application ID</label>
                        <input 
                            type="text" 
                            placeholder="Example: 65a2..." 
                            value={statusIdToSearch}
                            onChange={(e) => setStatusIdToSearch(e.target.value)}
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-lg py-3 px-5 font-medium text-slate-700 placeholder:text-slate-300 outline-none transition-all"
                        />
                    </div>
                    <button type="submit" className="w-full bg-[#1e293b] text-white py-4 rounded-lg font-medium cursor-pointer text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]">
                        Check Status Now
                    </button>
                </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Photo Cropper Modal */}
      <AnimatePresence>
        {isCropping && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="modal-backdrop z-[999]"
          >
             <button onClick={() => { setIsCropping(false); setImageSrc(null); }} className="modal-close-btn">
                <Icon icon="solar:close-circle-bold" />
             </button>

             <div className="cropper-container">
                <Cropper
                    image={imageSrc || ""} crop={crop} zoom={zoom} aspect={4/5}
                    onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom}
                />
             </div>

             <div className="cropper-controls">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-white text-sm font-bold">
                        <span>Zoom</span>
                        <span>{zoom.toFixed(1)}x</span>
                    </div>
                    <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-indigo-500" />
                </div>
                <div className="flex gap-4 w-full">
                   <button onClick={() => { setIsCropping(false); setImageSrc(null); }} className="flex-1 py-4 bg-white/5 rounded-2xl text-white font-bold hover:bg-white/10 transition-all">Cancel</button>
                   <button onClick={handleApplyCrop} className="flex-1 py-4 bg-indigo-600 rounded-2xl text-white font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all">Apply Crop</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
