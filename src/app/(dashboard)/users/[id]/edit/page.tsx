"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Phone, CreditCard, Upload, X, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/shared/Button";
import {
  validateMemberForm,
  validateImageFile,
  type MemberFormErrors,
} from "@/app/lib/utils/validators";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useSelector } from "react-redux";
import clsx from "clsx";

// ─── Design tokens ────────────────────────────────────────────────────────────

const inputBase =
  "w-full text-sm px-5 py-2.5 bg-gray-50/50 border rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none";

const inputOk = "border-gray-200";
const inputErr = "border-red-400 bg-red-50/30 focus:ring-red-100 focus:border-red-500";

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

const Label = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useSelector((state: any) => state.theme);
  return (
    <label className={clsx(
      "text-[12px] mb-1.5 inline-block font-bold uppercase tracking-wider",
      mode === "dark" ? "text-gray-400" : "text-gray-500"
    )}>
      {children}
    </label>
  );
};

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <span className="flex items-center gap-1 mt-1 text-[11px] text-red-500">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {msg}
    </span>
  ) : null;

const Hint = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useSelector((state: any) => state.theme);
  return (
    <span className={clsx("mt-1 text-[11px] leading-snug block", mode === "dark" ? "text-gray-500" : "text-gray-400")}>{children}</span>
  );
};

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
  const { mode } = useSelector((state: any) => state.theme);

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
          className={clsx(
            "relative w-full border rounded-lg overflow-hidden",
            error
              ? "border-red-400"
              : (mode === "dark" ? "border-gray-800" : "border-gray-200"),
            mode === "dark" ? "bg-slate-900" : "bg-white"
          )}
        >
          <img
            src={preview}
            alt={label}
            className="w-full h-36 object-contain"
          />
          <button
            type="button"
            onClick={() => { onClear(); if (ref.current) ref.current.value = ""; }}
            className={clsx(
              "absolute top-2 right-2 border rounded-full p-0.5 transition-colors",
              mode === "dark"
                ? "bg-slate-800 border-gray-700 hover:bg-red-950/20 hover:border-red-900"
                : "bg-white border-gray-200 hover:bg-red-50 hover:border-red-300"
            )}
          >
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className={clsx(
            "w-full flex flex-col items-center gap-2 py-6 border-2 border-dashed rounded-lg transition-all group",
            error
              ? "border-red-300 bg-red-50/30 hover:border-red-400"
              : (mode === "dark"
                ? "border-gray-800 bg-slate-900/30 hover:border-indigo-900 hover:bg-indigo-950/20"
                : "border-gray-200 bg-gray-50/50 hover:border-indigo-300 hover:bg-indigo-50/30")
          )}
        >
          <Upload className={clsx("w-5 h-5 transition-colors", error ? "text-red-400" : (mode === "dark" ? "text-gray-500 group-hover:text-indigo-400" : "text-gray-400 group-hover:text-indigo-500"))} />
          <span className={clsx("text-xs transition-colors", error ? "text-red-400" : (mode === "dark" ? "text-gray-500 group-hover:text-indigo-400" : "text-gray-400 group-hover:text-indigo-500"))}>
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
  const { mode } = useSelector((state: any) => state.theme);
  return (
    <div className={clsx("flex items-center gap-4 mb-8 p-1.5 rounded-xl border", mode === "dark" ? "bg-slate-900/40 border-gray-800" : "bg-gray-100/80 border-transparent")}>
      <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm", mode === "dark" ? "bg-indigo-950/30 text-indigo-400" : color)}>
        {step}
      </div>
      <div>
        <h3 className={clsx("text-base font-bold", mode === "dark" ? "text-white" : "text-gray-800")}>{title}</h3>
        <p className={clsx("text-xs", mode === "dark" ? "text-gray-400" : "text-gray-500")}>{sub}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialLoading, setInitialLoading] = useState(true);
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
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);

  // touched tracks which fields the user has interacted with
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<MemberFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/user/${id}`);
        if (data.success) {
          const user = data.data.user;
          setFormData({
            ...user,
            dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
          });
        } else {
          toast.error(data.message || "Failed to load member");
          router.push("/users");
        }
      } catch (err) {
        toast.error("An error occurred while loading member data");
        router.push("/users");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchUser();
  }, [id, router]);

  const set = (key: string, value: string) =>
    setFormData((f) => ({ ...f, [key]: value }));

  const touch = (key: string) =>
    setTouched((t) => ({ ...t, [key]: true }));

  // Revalidate on every change
  const revalidate = (
    data = formData,
    pf = photoFile,
    sf = signatureFile,
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

    const loadingToast = toast.loading("Updating member profile…");
    try {
      const fd = new FormData();

      // Scalar fields
      const { address, photo: _p, signature: _s, ...scalars } = formData;
      for (const [key, value] of Object.entries(scalars)) {
        if (value !== null && value !== undefined) {
          fd.append(key, value.toString());
        }
      }

      // Address fields
      for (const [key, value] of Object.entries(address)) {
        fd.append(`address.${key}`, value);
      }

      // Attach new files if uploaded
      if (photoFile) fd.append("photo", photoFile);
      if (signatureFile) fd.append("signature", signatureFile);

      const { data } = await axios.patch(`/api/user/${id}`, fd);

      if (data.success) {
        toast.success("Member updated successfully!", { id: loadingToast });
        router.push(`/users/${id}`);
      } else {
        toast.error(data.message || "Failed to update user", { id: loadingToast });
      }
    } catch {
      toast.error("Something went wrong", { id: loadingToast });
    }
  };


  const { mode } = useSelector((state: any) => state.theme);

  const err = (key: keyof MemberFormErrors) =>
    (submitted || touched[key]) ? errors[key] : undefined;

  const ic = (key: keyof MemberFormErrors) => {
    const isError = err(key);
    return clsx(
      "w-full text-sm px-5 py-2.5 border rounded-lg transition-all outline-none",
      mode === "dark"
        ? "bg-slate-900/60 focus:ring-indigo-950/40 focus:border-indigo-600"
        : "bg-gray-50/50 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600",
      isError
        ? (mode === "dark"
          ? "border-red-900 bg-red-950/10 focus:ring-red-950/20 focus:border-red-600"
          : "border-red-400 bg-red-50/30 focus:ring-red-100 focus:border-red-500")
        : (mode === "dark" ? "border-gray-800 text-white animate-in" : "border-gray-200 text-gray-900")
    );
  };

  if (initialLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Edit Member Profile"
        backLink={`/users/${id}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Members", href: "/users" },
          { label: formData.name, href: `/users/${id}` },
          { label: "Edit" },
        ]}
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-6">

        {/* ── 01 Personal Credentials ── */}
        <div className={clsx("rounded-xl p-8 md:p-10 border", mode === "dark" ? "bg-[#1c252e] border-gray-800 shadow-none ring-0" : "bg-white border-gray-100 ring-1 ring-gray-100 shadow-xs")}>
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
                className={clsx(
                  "w-full text-sm px-5 py-2.5 border rounded-lg transition-all outline-none appearance-none",
                  mode === "dark"
                    ? "bg-slate-900/60 border-gray-800 text-white focus:border-indigo-600"
                    : "bg-gray-50/50 border-gray-200 text-gray-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600"
                )}
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
        <div className={clsx("rounded-xl p-8 md:p-10 border", mode === "dark" ? "bg-[#1c252e] border-gray-800 shadow-none ring-0" : "bg-white border-gray-100 ring-1 ring-gray-100 shadow-xs")}>
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
                  type="text"
                  placeholder="1234 5678 9012"
                  autoComplete="off"
                  inputMode="numeric"
                  maxLength={14}
                  className={`${ic("adharNumber")} pl-10`}
                  value={formData.adharNumber}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
                    const fmt = raw.replace(/(\d{4})(\d{4})?(\d{4})?/, (_, a, b, c) =>
                      [a, b, c].filter(Boolean).join(" ")
                    );
                    set("adharNumber", fmt);
                    revalidate({ ...formData, adharNumber: fmt });
                  }}
                  onBlur={() => { touch("adharNumber"); revalidate(); }}
                />
              </div>
              <FieldError msg={err("adharNumber")} />
            </div>

            <div>
              <Label>Gender *</Label>
              <select
                className={clsx(
                  "w-full text-sm px-5 py-2.5 border rounded-lg transition-all outline-none appearance-none",
                  mode === "dark"
                    ? "bg-slate-900/60 border-gray-800 text-white focus:border-indigo-600"
                    : "bg-gray-50/50 border-gray-200 text-gray-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600"
                )}
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
                className={clsx(
                  "w-full text-sm px-5 py-2.5 border rounded-lg transition-all outline-none appearance-none",
                  mode === "dark"
                    ? "bg-slate-900/60 border-gray-800 text-white focus:border-indigo-600"
                    : "bg-gray-50/50 border-gray-200 text-gray-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600"
                )}
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
        <div className={clsx("rounded-xl p-8 md:p-10 border", mode === "dark" ? "bg-[#1c252e] border-gray-800 shadow-none ring-0" : "bg-white border-gray-100 ring-1 ring-gray-100 shadow-xs")}>
          <SectionHeader
            step="03"
            title="Residential Address"
            color="bg-amber-100 text-amber-600"
            sub="Current stay details"
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
                  { key: "tehsil", label: "Tehsil *", ph: "e.g. Kopar" },
                  { key: "district", label: "District *", ph: "e.g. Pune" },
                  { key: "state", label: "State *", ph: "e.g. Maharashtra" },
                  { key: "pincode", label: "Pincode *", ph: "e.g. 411001" },
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
        <div className={clsx("rounded-xl p-8 md:p-10 border", mode === "dark" ? "bg-[#1c252e] border-gray-800 shadow-none ring-0" : "bg-white border-gray-100 ring-1 ring-gray-100 shadow-xs")}>
          <SectionHeader
            step="04"
            title="Media & Verification"
            color="bg-pink-100 text-pink-600"
            sub="Update photo or signature"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

            <ImageUploadField
              label="Member Photo"
              hint="Leave blank to keep existing photo"
              preview={photoFile ? URL.createObjectURL(photoFile) : formData.photo}
              error={err("photo")}
              onFile={(b64, file) => {
                setPhotoFile(file);
                touch("photo");
                revalidate(formData, file, signatureFile);
              }}
              onClear={() => {
                setPhotoFile(null);
                revalidate(formData, null, signatureFile);
              }}
            />

            <ImageUploadField
              label="Signature"
              hint="Leave blank to keep existing signature"
              preview={signatureFile ? URL.createObjectURL(signatureFile) : formData.signature}
              error={err("signature")}
              onFile={(b64, file) => {
                setSignatureFile(file);
                touch("signature");
                revalidate(formData, photoFile, file);
              }}
              onClear={() => {
                setSignatureFile(null);
                revalidate(formData, photoFile, null);
              }}
            />

            <div className="col-span-1 md:col-span-2">
              <Label>Internal Notes</Label>
              <textarea
                rows={3}
                placeholder="Admin remarks…"
                className={clsx(
                  "w-full text-sm px-5 py-2.5 border rounded-lg transition-all outline-none resize-none",
                  mode === "dark"
                    ? "bg-slate-900/60 border-gray-800 text-white focus:border-indigo-600"
                    : "bg-gray-50/50 border-gray-200 text-gray-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600"
                )}
                value={formData.notes || ""}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>

            <div>
              <Label>Account Status : </Label>
              <div className="ml-2 inline-block">
                <StatusBadge size="sm" status={formData.status} />
              </div>
            </div>

          </div>
        </div>

        {/* ── Action Bar ── */}
        <div className="flex justify-end items-center gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/users/${id}`)}
            className="font-medium"
          // className={clsx("px-10 py-3 border text-sm font-medium rounded-2xl transition-all", mode === "dark" ? "bg-slate-900 border-gray-800 text-gray-400 hover:text-white" : "bg-white border-gray-200 hover:bg-gray-50")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="font-medium"

          // className={clsx("w-fit py-3 rounded-2xl text-sm font-medium flex items-center justify-center gap-3 bg-indigo-600 outline-none border-none", mode === "dark" ? "shadow-none" : "shadow-xl shadow-indigo-100")}
          >
            Update Member Profile
          </Button>
        </div>

      </form>
    </div>
  );
}
