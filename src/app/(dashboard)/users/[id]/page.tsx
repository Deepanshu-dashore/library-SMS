"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  BookOpen,
  Armchair,
  CheckCircle2,
  Clock,
  Edit3,
  Trash2,
  Users,
  BadgeCheck,
  Heart,
  Shield,
  FileText,
  ArrowLeft,
  Home,
  Hash,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/shared/Button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { generateAdmissionPDF } from "@/utils/pdfGenerator";
import { Download } from "lucide-react";
import { SimpleLoader } from "@/components/shared/SimpleLoader";
import clsx from "clsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserDetails {
  _id: string;
  name: string;
  fatherName: string;
  motherName: string;
  dob: string;
  maritalStatus: string;
  number: string;
  secondaryNumber?: string;
  category: string;
  gender: string;
  address: {
    detailedAddress: string;
    tehsil: string;
    district: string;
    state: string;
    pincode: string;
  };
  email: string;
  adharNumber: string;
  signature?: string;
  photo?: string;
  notes?: string;
  status: string;
  isVerified?: boolean;
  course?: string;
  createdAt: string;
  updatedAt: string;
}

interface SeatInfo {
  _id: string;
  seatNumber: string;
  price: number;
  type: string;
  floor?: string;
  status: string;
}

interface SubscriptionInfo {
  _id: string;
  seatId: SeatInfo;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

interface PaymentInfo {
  _id: string;
  amount: number;
  paymentMode: string;
  durationDays: number;
  receiptNumber: string;
  createdAt: string;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const age = (dob: string) => {
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
};

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  Active: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500", label: "Active" },
  Inactive: { bg: "bg-red-50 border-red-200", text: "text-red-700", dot: "bg-red-500", label: "Inactive" },
  Unverify: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500", label: "Pending Verification" },
};

// ─── Tiny shared atoms ────────────────────────────────────────────────────────

function SectionHeading({ icon: Icon, title }: { icon: any; title: string }) {
  const { mode } = useSelector((state: any) => state.theme);
  return (
    <div className={clsx(
      "flex items-center gap-3 mb-5 pb-2 border-b border-gray-200/60",
      mode === "dark" && "!border-gray-800"
    )}>
      {/* <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shadow-sm">
        <Icon size={16} className="text-slate-600" />
      </div> */}
      <h3 className={clsx("text-base font-semibold text-slate-700 capitalize", mode === "dark" && "!text-white")}>{title}</h3>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  const { mode } = useSelector((state: any) => state.theme);
  return (
    <div className="flex flex-col gap-1.5 transition-all group">
      <span className={clsx("text-[10px] font-bold text-slate-400 uppercase tracking-widest", mode === "dark" && "!text-slate-500")}>{label}</span>
      <span className={clsx("text-[13px] font-black text-slate-800 break-words leading-tight", mode === "dark" && "!text-slate-200")}>{value || "—"}</span>
    </div>
  );
}

function HorizontalInfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  const { mode } = useSelector((state: any) => state.theme);
  return (
    <div className={clsx(
      "flex items-center gap-2 group py-0.5 border-b pb-1 border-gray-100 border-dashed",
      mode === "dark" && "!border-gray-800/80"
    )}>
      <span className={clsx("text-sm font-semibold text-slate-800 w-28 shrink-0", mode === "dark" && "!text-slate-300")}>{label}:</span>
      <div className={clsx("text-sm font-medium text-slate-600 truncate flex-1 flex justify-end", mode === "dark" && "!text-slate-400")}>
        {value || "—"}
      </div>
    </div>
  );
}

function Divider() {
  const { mode } = useSelector((state: any) => state.theme);
  return <hr className={clsx("border-gray-100 border my-2", mode === "dark" && "!border-gray-800")} />;
}

function ImagePreviewModal({
  images,
  initialIndex,
  onClose,
}: {
  images: { src: string; title: string }[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [currentIndex, onClose]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const activeImage = images[currentIndex];
  if (!activeImage) return null;

  return (
    <div
      className="fixed inset-0 z-[200000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-8 select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={activeImage.title}
    >
      {/* Close (Cut) Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 z-[210000] cursor-pointer rounded-full bg-white/5 hover:bg-white/10 p-2.5 text-white/70 hover:text-white transition-all hover:scale-105 duration-200 border border-white/5 shadow-sm flex items-center justify-center"
        aria-label="Close preview"
      >
        <X size={20} />
      </button>

      {/* Left Navigation Arrow */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-6 z-[210000] cursor-pointer rounded-full bg-white/5 hover:bg-white/10 p-2.5 text-white/60 hover:text-white transition-all hover:scale-105 duration-200 border border-white/5 flex items-center justify-center shadow-sm"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Right Navigation Arrow */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-6 z-[210000] cursor-pointer rounded-full bg-white/5 hover:bg-white/10 p-2.5 text-white/60 hover:text-white transition-all hover:scale-105 duration-200 border border-white/5 flex items-center justify-center shadow-sm"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      )}

      <div
        className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center gap-4 px-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-2xl overflow-hidden bg-slate-950/20 border border-white/5 flex items-center justify-center max-w-full shadow-2xl">
          <img
            src={activeImage.src}
            alt={activeImage.title}
            className="max-w-full max-h-[70vh] object-contain rounded-2xl"
          />
        </div>
        <div className="text-center flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-white/95 tracking-wide">{activeImage.title}</p>
          {images.length > 1 && (
            <p className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mt-0.5">
              {currentIndex + 1} of {images.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-48 bg-gray-100 rounded-[32px]" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-48 bg-gray-100 rounded-[32px]" />
          <div className="h-32 bg-gray-100 rounded-[32px]" />
        </div>
        <div className="space-y-4">
          <div className="h-40 bg-gray-100 rounded-[32px]" />
          <div className="h-32 bg-gray-100 rounded-[32px]" />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ViewUserPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { currentUser } = useSelector((state: any) => state.user);
  const { mode } = useSelector((state: any) => state.theme);

  const [user, setUser] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/user/${id}`);
        if (data.success) {
          setUser(data.data.user);
          setSubscription(data.data.subscription);
          setPayment(data.data.payment);
        } else {
          toast.error(data.message || "Failed to load member");
        }
      } catch {
        toast.error("An error occurred while loading member data");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm(`Delete member "${user?.name}"? This action cannot be undone.`)) return;
    const t = toast.loading("Deleting member…");
    try {
      const { data } = await axios.delete(`/api/user/soft-delete/${id}`);
      if (data.success) {
        toast.success("Member deleted", { id: t });
        router.push("/users");
      } else {
        toast.error(data.message || "Delete failed", { id: t });
      }
    } catch {
      toast.error("Something went wrong", { id: t });
    }
  };

  const handleVerify = async () => {
    if (!user) return;
    setIsVerifying(true);
    const t = toast.loading(`Verifying ${user.name}…`);
    try {
      const { data } = await axios.patch(`/api/user/verify/${id}`);
      if (data.success) {
        toast.success("Member verified successfully", { id: t });
        setUser((prev) => (prev ? { ...prev, status: "Active", isVerified: true } : prev));
      } else {
        toast.error(data.message || "Verification failed", { id: t });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong", { id: t });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!user) return;
    setIsDownloading(true);
    const t = toast.loading("Preparing Admission Form...", {
      style: {
        borderRadius: '16px',
        background: '#333',
        color: '#fff',
      },
    });
    try {
      await generateAdmissionPDF(user, subscription, currentUser);
      toast.success("Ready for Download!", { id: t });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF", { id: t });
    } finally {
      setIsDownloading(false);
    }
  };

  // ── Render states ──
  if (loading) return <SimpleLoader text="Fetching Member" />;

  if (!user) {
    return (
      <div className={clsx("min-h-screen flex items-center justify-center bg-transparent", mode !== "dark" && "bg-gray-50/50")}>
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <User size={36} className="text-red-400" />
          </div>
          <h2 className={clsx("text-xl font-black text-gray-900", mode === "dark" && "!text-white")}>Member Not Found</h2>
          <p className="text-gray-500 text-sm">This member may have been deleted or does not exist.</p>
          <Button variant="outline" onClick={() => router.push("/users")}>
            <ArrowLeft size={16} /> Back to Members
          </Button>
        </div>
      </div>
    );
  }

  const sc = statusConfig[user.status] ?? statusConfig.Unverify;
  const isVerified = !!(user.isVerified || user.status === "Active");
  const subActive = subscription && new Date(subscription.endDate) >= new Date() && subscription.status === "active";
  const subExpired = subscription && new Date(subscription.endDate) < new Date() && subscription.status === "active";
  const subStatus = !subscription ? null : subscription.status === "cancelled" ? "cancelled" : subExpired ? "expired" : "active";

  const previewImages: { src: string; title: string }[] = [];
  if (user?.photo) {
    previewImages.push({ src: user.photo, title: `${user.name} — Photo` });
  }
  if (user?.signature) {
    previewImages.push({ src: user.signature, title: `${user.name} — Signature` });
  }

  const subStatusStyles: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    expired: "bg-amber-50 text-amber-700 border-amber-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className={clsx("min-h-screen pb-20 bg-transparent", mode !== "dark" && "bg-gray-50/50")}>
      <div className="max-w-[1200px] mx-auto">

        {/* Page Header */}
        <PageHeader
          title={`${user.name} Details`}
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Users", href: "/users" },
            { label: user.name },
          ]}
          backLink="/users"
          actionNode={
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="view"
                size="md"
                icon="line-md:download"
                onClick={handleDownloadPDF}
                isLoading={isDownloading}
                className="rounded-lg gap-2 py-2 px-4 h-9 font-medium"
              >
                Download PDF
              </Button>
              {!subscription && (
                isVerified ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push(`/subscriptions/add?userId=${id}`)}
                    className="rounded-lg gap-2 py-2 px-4 h-9"
                  >
                    <Armchair size={15} />
                    Assign Seat
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleVerify}
                    isLoading={isVerifying}
                    className="rounded-lg gap-2 py-2 px-4 h-9"
                  >
                    <BadgeCheck size={15} />
                    Verify User
                  </Button>
                )
              )}
              <Button
                variant="edit"
                size="md"
                onClick={() => router.push(`/users/${id}/edit`)}
                className="rounded-lg gap-2 py-2 px-4 h-9 font-medium"
              >
                Edit
              </Button>
              <Button
                variant="delete"
                size="md"
                onClick={handleDelete}
                className="rounded-lg gap-2 py-2 px-4 h-9 font-medium"
              >
                Delete
              </Button>
            </div>
          }
        />

        {/* ── Hero Profile Card ── */}
        <div className={clsx(
          "bg-white rounded-2xl border border-gray-100 p-5 mb-6 transition-all duration-300",
          mode === "dark"
            ? "!bg-[#1c252e] !border-gray-800 shadow-[0_0_2px_0_rgba(0,0,0,0.15),0_12px_24px_-4px_rgba(0,0,0,0.05)]"
            : "shadow-xs"
        )}>
          <div className="flex items-center gap-5">

            {/* Avatar */}
            <div className="shrink-0">
              {user.photo ? (
                <button
                  type="button"
                  onClick={() => setPreviewImageIndex(0)}
                  className="relative group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  aria-label="View photo"
                >
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100 group-hover:opacity-90 transition-opacity"
                  />
                  <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn size={18} className="text-white" />
                  </span>
                </button>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-800 text-white flex items-center justify-center text-2xl font-black">
                  {user.name[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* Name & info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <h1 className={clsx("text-xl font-bold text-slate-900 tracking-tight", mode === "dark" && "!text-white")}>{user.name}</h1>
                <StatusBadge status={user.status} size="xs" />
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><Mail size={13} className="text-slate-400" />{user.email}</span>
                <span className="flex items-center gap-1.5"><Phone size={13} className="text-slate-400" />{user.number}</span>
                {user.secondaryNumber && (
                  <span className="flex items-center gap-1.5"><Phone size={13} className="text-slate-400" />{user.secondaryNumber}</span>
                )}
                <span className="flex items-center gap-1.5"><MapPin size={13} className="text-slate-400" />{user.address.district}, {user.address.state}</span>
              </div>
            </div>

            {/* Member Since */}
            <div className="text-right shrink-0 hidden sm:block">
              <p className={clsx("text-xs font-bold text-slate-800 capitalize", mode === "dark" && "!text-slate-400")}>Join At</p>
              <p className={clsx("text-[13px] font-medium text-slate-600", mode === "dark" && "!text-slate-300")}>{fmt(user.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ─ Left: Personal + Address + Notes ─ */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <div className={clsx(
                "bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300",
                mode === "dark"
                  ? "!bg-[#1c252e] !border-gray-800 shadow-[0_0_2px_0_rgba(0,0,0,0.15),0_12px_24px_-4px_rgba(0,0,0,0.05)]"
                  : "shadow-xs"
              )}>
                <SectionHeading icon={Users} title="Personal Info" />
                <div className="space-y-3.5">
                  <HorizontalInfoRow label="Father" value={user.fatherName} />
                  <HorizontalInfoRow label="Mother" value={user.motherName} />
                  <HorizontalInfoRow label="DOB" value={fmt(user.dob)} />
                  <HorizontalInfoRow label="Age" value={`${age(user.dob)}`} />
                  <HorizontalInfoRow label="Gender" value={user.gender} />
                  <HorizontalInfoRow label="Category" value={user.category} />
                  <HorizontalInfoRow label="Marital" value={user.maritalStatus} />
                  <HorizontalInfoRow label="Adhar" value={user.adharNumber} />
                </div>
              </div>

              <div className={clsx(
                "bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300",
                mode === "dark"
                  ? "!bg-[#1c252e] !border-gray-800 shadow-[0_0_2px_0_rgba(0,0,0,0.15),0_12px_24px_-4px_rgba(0,0,0,0.05)]"
                  : "shadow-xs"
              )}>
                <SectionHeading icon={MapPin} title="Address" />
                <div className="space-y-4">
                  <div className={clsx("text-slate-700 leading-relaxed font-medium", mode === "dark" && "!text-slate-300")}>
                    <p className={clsx("text-sm font-semibold text-slate-800 mb-1.5", mode === "dark" && "!text-white")}>Primary Residence</p>
                    <p className={clsx("text-base font-medium text-slate-700/90", mode === "dark" && "!text-slate-400")}>{user.address.detailedAddress}</p>
                  </div>

                  <div className={clsx("space-y-3 pt-2 border-t border-gray-50", mode === "dark" && "!border-gray-800")}>
                    <div className="flex items-center gap-3 text-slate-600">
                      <MapPin size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      <span className={clsx("text-sm font-semibold", mode === "dark" && "text-slate-300")}>{user.address.district}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Home size={18} className="text-slate-400" />
                      <span className={clsx("text-sm font-semibold", mode === "dark" && "text-slate-300")}>{user.address.state}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Hash size={18} className="text-slate-400" />
                      <span className={clsx("text-sm font-semibold text-slate-800", mode === "dark" && "!text-white")}>{user.address.pincode}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo + Signature Row */}
            <div className="grid grid-cols-2 gap-5">
              {/* Photo */}
              <div className={clsx(
                "bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-300",
                mode === "dark"
                  ? "!bg-[#1c252e] !border-gray-800 shadow-[0_0_2px_0_rgba(0,0,0,0.15),0_12px_24px_-4px_rgba(0,0,0,0.05)]"
                  : "shadow-xs"
              )}>
                <SectionHeading icon={User} title="Photo" />
                {user.photo ? (
                  <button
                    type="button"
                    onClick={() => setPreviewImageIndex(0)}
                    className="relative group w-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label="View photo full size"
                  >
                    <img
                      src={user.photo}
                      alt={`${user.name} photo`}
                      className="w-full h-60 object-cover rounded-xl border border-gray-100 group-hover:opacity-90 transition-opacity"
                    />
                    <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn size={28} className="text-white" />
                    </span>
                  </button>
                ) : (
                  <div className={clsx(
                    "w-full h-60 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2",
                    mode === "dark" ? "bg-slate-800/40 border-gray-700" : "bg-gray-50 border-gray-200"
                  )}>
                    <User size={28} className="text-gray-300" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No photo</p>
                  </div>
                )}
              </div>

              {/* Signature */}
              <div className={clsx(
                "bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-300",
                mode === "dark"
                  ? "!bg-[#1c252e] !border-gray-800 shadow-[0_0_2px_0_rgba(0,0,0,0.15),0_12px_24px_-4px_rgba(0,0,0,0.05)]"
                  : "shadow-xs"
              )}>
                <SectionHeading icon={BadgeCheck} title="Signature" />
                {user.signature ? (
                  <button
                    type="button"
                    onClick={() => setPreviewImageIndex(user.photo ? 1 : 0)}
                    className={clsx(
                      "relative group w-full h-60 rounded-xl border p-4 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all",
                      mode === "dark" ? "bg-slate-800/40 border-gray-800" : "bg-gray-50 border-gray-100"
                    )}
                    aria-label="View signature full size"
                  >
                    <img
                      src={user.signature}
                      alt="Signature"
                      className="max-h-full max-w-full object-contain group-hover:opacity-80 transition-opacity"
                    />
                    <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn size={28} className="text-white" />
                    </span>
                  </button>
                ) : (
                  <div className={clsx(
                    "w-full h-60 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2",
                    mode === "dark" ? "bg-slate-800/40 border-gray-700" : "bg-gray-50 border-gray-200"
                  )}>
                    <BadgeCheck size={28} className="text-gray-300" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No signature</p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {user.notes && (
              <div className={clsx(
                "bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300",
                mode === "dark"
                  ? "!bg-[#1c252e] !border-gray-800 shadow-[0_0_2px_0_rgba(0,0,0,0.15),0_12px_24px_-4px_rgba(0,0,0,0.05)]"
                  : "shadow-xs"
              )}>
                <SectionHeading icon={FileText} title="Internal Notes" />
                <div className={clsx(
                  "rounded-2xl p-5 border",
                  mode === "dark" ? "bg-amber-950/20 border-amber-900/40" : "bg-amber-50 border-amber-100"
                )}>
                  <p className={clsx("text-sm font-medium leading-relaxed whitespace-pre-wrap", mode === "dark" ? "text-amber-350" : "text-amber-900")}>{user.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* ─ Right Sidebar: Critical business data first ─ */}
          <div className="space-y-6">

            {/* Subscription & Seat */}
            {/* ── Seat Card (only if subscribed) ── */}
            {subscription && (
              <div className={clsx(
                "bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-300",
                mode === "dark"
                  ? "!bg-[#1c252e] !border-gray-800 shadow-[0_0_2px_0_rgba(0,0,0,0.15),0_12px_24px_-4px_rgba(0,0,0,0.05)]"
                  : "shadow-xs"
              )}>
                <SectionHeading icon={Armchair} title="Seat" />
                <div className="space-y-2.5">
                  <HorizontalInfoRow label="Seat Number" value={subscription.seatId.seatNumber} />
                  <HorizontalInfoRow label="Seat Type" value={subscription.seatId.type} />
                  <HorizontalInfoRow label="Seat Floor" value={subscription.seatId.floor} />
                  <HorizontalInfoRow label="Seat Status" value={<StatusBadge status={subscription.seatId.status ?? "available"} size="xs" />} />
                </div>
              </div>
            )}

            {/* ── Subscription Card ── */}
            <div className={clsx(
              "bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-300",
              mode === "dark"
                ? "!bg-[#1c252e] !border-gray-800 shadow-[0_0_2px_0_rgba(0,0,0,0.15),0_12px_24px_-4px_rgba(0,0,0,0.05)]"
                : "shadow-xs"
            )}>
              <SectionHeading icon={Clock} title="Subscription" />

              {subscription ? (
                <>
                  <div className="space-y-2.5">
                    <HorizontalInfoRow label="Status" value={<StatusBadge status={subscription.status ?? "active"} size="xs" />} />
                    <HorizontalInfoRow label="Start" value={fmt(subscription.startDate)} />
                    <HorizontalInfoRow label="Expiry" value={<span className={clsx(subExpired && "text-red-600")}>{fmt(subscription.endDate)}</span>} />
                  </div>

                  {subExpired && (
                    <Button
                      fullWidth
                      variant="primary"
                      className="rounded-xl py-2.5 justify-center text-sm mt-4"
                      onClick={() => router.push(`/subscriptions/renew/${subscription._id}`)}
                    >
                      <Clock size={15} />
                      Renew Subscription
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center gap-3">
                  <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center", mode === "dark" ? "bg-slate-800" : "bg-gray-100")}>
                    <Armchair size={24} className="text-gray-400" />
                  </div>
                  <p className="font-bold text-gray-400 text-sm">
                    {isVerified ? "No active subscription" : "Member pending verification"}
                  </p>
                  {isVerified ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => router.push(`/subscriptions/add?userId=${id}`)}
                      className="rounded-xl"
                    >
                      <Armchair size={15} />
                      Assign Seat
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleVerify}
                      isLoading={isVerifying}
                      className="rounded-xl gap-2"
                    >
                      <BadgeCheck size={15} />
                      Verify User
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Latest Payment */}
            {payment && (
              <div className={clsx(
                "bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-300",
                mode === "dark"
                  ? "!bg-[#1c252e] !border-gray-800 shadow-[0_0_2px_0_rgba(0,0,0,0.15),0_12px_24px_-4px_rgba(0,0,0,0.05)]"
                  : "shadow-xs"
              )}>
                <SectionHeading icon={CreditCard} title="Latest Payment" />

                <div className="space-y-2.5">
                  <HorizontalInfoRow label="Amount" value={<span className={clsx("font-black text-slate-900", mode === "dark" && "!text-white")}>₹{payment.amount}</span>} />
                  <HorizontalInfoRow label="Mode" value={payment.paymentMode} />
                  <HorizontalInfoRow label="Receipt" value={payment.receiptNumber} />
                  <HorizontalInfoRow label="Duration" value={`${payment.durationDays} days`} />
                  <HorizontalInfoRow label="Date" value={fmt(payment.createdAt)} />
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {mounted && previewImageIndex !== null && createPortal(
        <ImagePreviewModal
          images={previewImages}
          initialIndex={previewImageIndex}
          onClose={() => setPreviewImageIndex(null)}
        />,
        document.body
      )}
    </div>
  );
}
