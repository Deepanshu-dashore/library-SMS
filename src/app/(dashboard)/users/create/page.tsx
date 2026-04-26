"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Phone, CreditCard, Upload, X, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/shared/Button";
import {
  validateMemberForm,
  validateImageFile,
  type MemberFormErrors,
} from "@/app/lib/utils/validators";

// ─── Design tokens ────────────────────────────────────────────────────────────

const inputBase =
  "w-full text-sm px-5 py-2.5 bg-gray-50/50 border rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none";

const inputOk  = "border-gray-200";
const inputErr = "border-red-400 bg-red-50/30 focus:ring-red-100 focus:border-red-500";

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[12px] mb-1.5 inline-block font-bold text-gray-500 uppercase tracking-wider">
    {children}
  </label>
);

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <span className="flex items-center gap-1 mt-1 text-[11px] text-red-500">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {msg}
    </span>
  ) : null;

const Hint = ({ children }: { children: React.ReactNode }) => (
  <span className="mt-1 text-[11px] text-gray-400 leading-snug block">{children}</span>
);

// ─── Image Upload Field ───────────────────────────────────────────────────────

interface ImageUploadFieldProps {
  label: string;
  hint: React.ReactNode;
  preview: string;
  error?: string;
  onFile: (base64: string, file: File) => void;
  onClear: () => void;
}

function ImageUploadField({ label, hint, preview, error, onFile, onClear }: ImageUploadFieldProps) {
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const err = validateImageFile(file, label);
    if (err) {
      toast.error(err);
      if (ref.current) ref.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onFile(reader.result as string, file);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Label>{label}</Label>

      {preview ? (
        <div
          className={`relative w-full border rounded-lg overflow-hidden ${
            error ? "border-red-400" : "border-gray-200"
          } bg-white`}
        >
          <img
            src={preview}
            alt={label}
            className="w-full h-36 object-contain"
          />
          <button
            type="button"
            onClick={() => { onClear(); if (ref.current) ref.current.value = ""; }}
            className="absolute top-2 right-2 bg-white border border-gray-200 rounded-full p-0.5 hover:bg-red-50 hover:border-red-300 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className={`w-full flex flex-col items-center gap-2 py-6 border-2 border-dashed rounded-lg transition-all group ${
            error
              ? "border-red-300 bg-red-50/30 hover:border-red-400"
              : "border-gray-200 bg-gray-50/50 hover:border-indigo-300 hover:bg-indigo-50/30"
          }`}
        >
          <Upload className={`w-5 h-5 transition-colors ${error ? "text-red-400" : "text-gray-400 group-hover:text-indigo-500"}`} />
          <span className={`text-xs transition-colors ${error ? "text-red-400" : "text-gray-400 group-hover:text-indigo-500"}`}>
            Click to upload — JPG, PNG, or WebP · max 2 MB
          </span>
        </button>
      )}

      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />

      <FieldError msg={error} />
      {!error && <Hint>{hint}</Hint>}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  step, title, sub, color,
}: { step: string; title: string; sub: string; color: string }) {
  return (
    <div className="flex items-center gap-4 mb-8 bg-gray-100/70 p-1.5 rounded-xl">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center font-bold text-sm`}>
        {step}
      </div>
      <div>
        <h3 className="text-base font-bold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500">{sub}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
    status: "Active",
  });

  // Raw File objects — needed for type/size validation
  const [photoFile,     setPhotoFile]     = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);

  // touched tracks which fields the user has interacted with
  const [touched,  setTouched]  = useState<Record<string, boolean>>({});
  const [errors,   setErrors]   = useState<MemberFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key: string, value: string) =>
    setFormData((f) => ({ ...f, [key]: value }));

  const touch = (key: string) =>
    setTouched((t) => ({ ...t, [key]: true }));

  // Revalidate on every change — errors surface only after touch or submit
  const revalidate = (
    data = formData,
    pf   = photoFile,
    sf   = signatureFile,
  ) => {
    const errs = validateMemberForm(data, pf, sf);
    setErrors(errs);
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = revalidate();

    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the highlighted errors before submitting.");
      return;
    }

    const loadingToast = toast.loading("Creating new member…");
    try {
      // Build multipart/form-data so the controller can receive real File objects
      const fd = new FormData();

      // Scalar fields
      const { address, photo: _p, signature: _s, ...scalars } = formData;
      for (const [key, value] of Object.entries(scalars)) {
        fd.append(key, value);
      }

      // Address fields — flattened with dot-notation for the controller parser
      for (const [key, value] of Object.entries(address)) {
        fd.append(`address.${key}`, value);
      }

      // Attach File objects (not base64 strings) for Cloudinary upload
      if (photoFile)     fd.append("photo",     photoFile);
      if (signatureFile) fd.append("signature", signatureFile);

      const res = await fetch("/api/user", {
        method: "POST",
        // Do NOT set Content-Type — browser sets it with the correct boundary
        body: fd,
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Member created successfully!", { id: loadingToast });
        router.push(`/subscriptions/add?memberId=${data.data._id}`);
      } else {
        toast.error(data.message || "Failed to create user", { id: loadingToast });
      }
    } catch {
      toast.error("Something went wrong", { id: loadingToast });
    }
  };


  // Helper: show error only when field is touched OR form was submitted
  const err = (key: keyof MemberFormErrors) =>
    (submitted || touched[key]) ? errors[key] : undefined;

  // ── Input classes helper ──
  const ic = (key: keyof MemberFormErrors) =>
    `${inputBase} ${err(key) ? inputErr : inputOk}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <PageHeader
        title="Create New Member"
        backLink="/users"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Members", href: "/users" },
          { label: "Create" },
        ]}
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-6">

        {/* ── 01 Personal Credentials ── */}
        <div className="bg-white rounded-xl p-8 md:p-10 shadow-xs border border-gray-100 ring-1 ring-gray-100">
          <SectionHeader
            step="01"
            title="Personal Credentials"
            sub="Identity and basic background information"
            color="bg-indigo-100 text-indigo-600"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">

            <div>
              <Label>Full Name *</Label>
              <input
                type="text" placeholder="e.g. John Doe"
                className={ic("name")}
                value={formData.name}
                onChange={(e) => { set("name", e.target.value); revalidate({ ...formData, name: e.target.value }); }}
                onBlur={() => { touch("name"); revalidate(); }}
              />
              <FieldError msg={err("name")} />
            </div>

            <div>
              <Label>Email Address *</Label>
              <input
                type="email" placeholder="john@example.com"
                className={ic("email")}
                value={formData.email}
                onChange={(e) => { set("email", e.target.value); revalidate({ ...formData, email: e.target.value }); }}
                onBlur={() => { touch("email"); revalidate(); }}
              />
              <FieldError msg={err("email")} />
            </div>

            <div>
              <Label>Father's Name *</Label>
              <input
                type="text" placeholder="e.g. Ram Doe"
                className={ic("fatherName")}
                value={formData.fatherName}
                onChange={(e) => { set("fatherName", e.target.value); revalidate({ ...formData, fatherName: e.target.value }); }}
                onBlur={() => { touch("fatherName"); revalidate(); }}
              />
              <FieldError msg={err("fatherName")} />
            </div>

            <div>
              <Label>Mother's Name *</Label>
              <input
                type="text" placeholder="e.g. Sita Doe"
                className={ic("motherName")}
                value={formData.motherName}
                onChange={(e) => { set("motherName", e.target.value); revalidate({ ...formData, motherName: e.target.value }); }}
                onBlur={() => { touch("motherName"); revalidate(); }}
              />
              <FieldError msg={err("motherName")} />
            </div>

            <div>
              <Label>Date of Birth *</Label>
              <input
                type="date"
                className={ic("dob")}
                value={formData.dob}
                onChange={(e) => { set("dob", e.target.value); revalidate({ ...formData, dob: e.target.value }); }}
                onBlur={() => { touch("dob"); revalidate(); }}
              />
              <FieldError msg={err("dob")} />
            </div>

            <div>
              <Label>Marital Status *</Label>
              <select
                className={`${inputBase} ${inputOk} appearance-none`}
                value={formData.maritalStatus}
                onChange={(e) => set("maritalStatus", e.target.value)}
              >
                <option value="Unmarried">Unmarried</option>
                <option value="Married">Married</option>
              </select>
            </div>

          </div>
        </div>

        {/* ── 02 Contact & Security ── */}
        <div className="bg-white rounded-xl p-8 md:p-10 shadow-xs border border-gray-100 ring-1 ring-gray-100">
          <SectionHeader
            step="02"
            title="Contact & Security"
            sub="How we can reach and identify the member"
            color="bg-emerald-100 text-emerald-600"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">

            <div>
              <Label>Mobile Number *</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel" placeholder="+91 98765 43210"
                  className={`${ic("number")} pl-10`}
                  value={formData.number}
                  onChange={(e) => { set("number", e.target.value); revalidate({ ...formData, number: e.target.value }); }}
                  onBlur={() => { touch("number"); revalidate(); }}
                />
              </div>
              <FieldError msg={err("number")} />
              {!err("number") && <Hint>10-digit Indian mobile number.</Hint>}
            </div>

            <div>
              <Label>Secondary Number</Label>
              <input
                type="tel" placeholder="Optional alternate number"
                className={`${inputBase} ${inputOk}`}
                value={formData.secondaryNumber}
                onChange={(e) => set("secondaryNumber", e.target.value)}
              />
            </div>

            <div>
              <Label>Aadhar Number *</Label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text" placeholder="1234 5678 9012"
                  maxLength={14}
                  className={`${ic("adharNumber")} pl-10`}
                  value={formData.adharNumber}
                  onChange={(e) => {
                    // auto-format: insert spaces at positions 4 and 9
                    const raw   = e.target.value.replace(/\D/g, "").slice(0, 12);
                    const fmt   = raw.replace(/(\d{4})(\d{4})?(\d{4})?/, (_, a, b, c) =>
                      [a, b, c].filter(Boolean).join(" ")
                    );
                    set("adharNumber", fmt);
                    revalidate({ ...formData, adharNumber: fmt });
                  }}
                  onBlur={() => { touch("adharNumber"); revalidate(); }}
                />
              </div>
              <FieldError msg={err("adharNumber")} />
              {!err("adharNumber") && <Hint>12-digit Aadhar number.</Hint>}
            </div>

            <div>
              <Label>Gender *</Label>
              <select
                className={`${inputBase} ${inputOk} appearance-none`}
                value={formData.gender}
                onChange={(e) => set("gender", e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <Label>Category *</Label>
              <select
                className={`${inputBase} ${inputOk} appearance-none`}
                value={formData.category}
                onChange={(e) => set("category", e.target.value)}
              >
                <option value="General">General</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OBC">OBC</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            <div>
              <Label>Course / Goal</Label>
              <input
                type="text" placeholder="e.g. UPSC, CA, JEE"
                className={`${inputBase} ${inputOk}`}
                value={formData.course}
                onChange={(e) => set("course", e.target.value)}
              />
            </div>

          </div>
        </div>

        {/* ── 03 Residential Address ── */}
        <div className="bg-white rounded-xl p-8 md:p-10 shadow-xs border border-gray-100 ring-1 ring-gray-100">
          <SectionHeader
            step="03"
            title="Residential Address"
            sub="Where the member stays currently"
            color="bg-amber-200/40 text-amber-600"
          />

          <div className="space-y-5">
            <div>
              <Label>Detailed Address *</Label>
              <textarea
                rows={3}
                placeholder="House / flat no., street, locality…"
                className={`${ic("detailedAddress")} resize-none`}
                value={formData.address.detailedAddress}
                onChange={(e) => {
                  setFormData((f) => ({ ...f, address: { ...f.address, detailedAddress: e.target.value } }));
                  revalidate({ ...formData, address: { ...formData.address, detailedAddress: e.target.value } });
                }}
                onBlur={() => { touch("detailedAddress"); revalidate(); }}
              />
              <FieldError msg={err("detailedAddress")} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {(
                [
                  { key: "tehsil",   label: "Tehsil *",   ph: "e.g. Kopar" },
                  { key: "district", label: "District *",  ph: "e.g. Pune" },
                  { key: "state",    label: "State *",     ph: "e.g. Maharashtra" },
                  { key: "pincode",  label: "Pincode *",   ph: "e.g. 411001" },
                ] as const
              ).map(({ key, label, ph }) => (
                <div key={key}>
                  <Label>{label}</Label>
                  <input
                    type="text" placeholder={ph}
                    className={ic(key as keyof MemberFormErrors)}
                    value={formData.address[key]}
                    onChange={(e) => {
                      setFormData((f) => ({ ...f, address: { ...f.address, [key]: e.target.value } }));
                      revalidate({ ...formData, address: { ...formData.address, [key]: e.target.value } });
                    }}
                    onBlur={() => { touch(key); revalidate(); }}
                  />
                  <FieldError msg={err(key as keyof MemberFormErrors)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 04 Media & Verification ── */}
        <div className="bg-white rounded-xl p-8 md:p-10 shadow-xs border border-gray-100 ring-1 ring-gray-100">
          <SectionHeader
            step="04"
            title="Media & Verification"
            sub="Photo, signature and internal notes"
            color="bg-pink-200/40 text-pink-600"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

            {/* Member Photo */}
            <ImageUploadField
              label="Member Photo"
              hint={
                <>
                  Passport-size photo · clear face, light/plain background ·{" "}
                  <span className="font-semibold text-gray-500">JPG / PNG · max 2 MB</span>
                </>
              }
              preview={formData.photo}
              error={err("photo")}
              onFile={(b64, file) => {
                set("photo", b64);
                setPhotoFile(file);
                touch("photo");
                revalidate(formData, file, signatureFile);
              }}
              onClear={() => {
                set("photo", "");
                setPhotoFile(null);
                revalidate(formData, null, signatureFile);
              }}
            />

            {/* Signature */}
            <ImageUploadField
              label="Signature"
              hint={
                <>
                  Sign on <span className="font-semibold text-gray-500">white / transparent</span> paper,
                  then scan or photograph · JPG / PNG · max 2 MB
                </>
              }
              preview={formData.signature}
              error={err("signature")}
              onFile={(b64, file) => {
                set("signature", b64);
                setSignatureFile(file);
                touch("signature");
                revalidate(formData, photoFile, file);
              }}
              onClear={() => {
                set("signature", "");
                setSignatureFile(null);
                revalidate(formData, photoFile, null);
              }}
            />

            {/* Notes */}
            <div className="col-span-1 md:col-span-2">
              <Label>Internal Notes</Label>
              <textarea
                rows={3}
                placeholder="Admin remarks, special instructions…"
                className={`${inputBase} ${inputOk} resize-none`}
                value={formData.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>

          </div>
          {/* status = "Active" is sent silently — not shown in UI */}
        </div>

        {/* ── Action Bar ── */}
        <div className="flex justify-end items-center gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/users")}
            className="px-10 py-3 bg-white border border-gray-200 text-sm text-gray-500 font-medium rounded-xl hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="w-fit py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 bg-indigo-600 outline-none border-none"
          >
            Create Member Profile
          </Button>
        </div>

      </form>
    </div>
  );
}
