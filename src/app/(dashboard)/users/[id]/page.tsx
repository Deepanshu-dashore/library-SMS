"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/shared/Button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { generateAdmissionPDF } from "@/utils/pdfGenerator";
import { Download } from "lucide-react";
import { SimpleLoader } from "@/components/shared/SimpleLoader";

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
  Active:   { bg: "bg-emerald-50 border-emerald-200",  text: "text-emerald-700", dot: "bg-emerald-500", label: "Active"   },
  Inactive: { bg: "bg-red-50 border-red-200",           text: "text-red-700",     dot: "bg-red-500",    label: "Inactive" },
  Unverify: { bg: "bg-amber-50 border-amber-200",        text: "text-amber-700",   dot: "bg-amber-500",   label: "Pending Verification" },
};

// ─── Tiny shared atoms ────────────────────────────────────────────────────────

function SectionHeading({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-2 border-b border-gray-200/60">
      {/* <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shadow-sm">
        <Icon size={16} className="text-slate-600" />
      </div> */}
      <h3 className="text-base font-semibold text-slate-700 capitalize">{title}</h3>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-1.5 transition-all group">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-[13px] font-black text-slate-800 break-words leading-tight">{value || "—"}</span>
    </div>
  );
}

function HorizontalInfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 group py-0.5 border-b pb-1 border-gray-100 border-dashed">
      <span className="text-sm font-semibold text-slate-800 w-28 shrink-0">{label}:</span>
      <div className="text-sm font-medium text-slate-600 truncate flex-1 flex justify-end">
        {value || "—"}
      </div>
    </div>
  );
}

function Divider() {
  return <hr className="border-gray-100 border my-2" />;
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
  const params  = useParams();
  const router  = useRouter();
  const id      = params.id as string;

  const [user,         setUser]         = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [payment,      setPayment]      = useState<PaymentInfo | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

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
      await generateAdmissionPDF(user, subscription);
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
      <div className="bg-gray-50/50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <User size={36} className="text-red-400" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Member Not Found</h2>
          <p className="text-gray-500 text-sm">This member may have been deleted or does not exist.</p>
          <Button variant="outline" onClick={() => router.push("/users")}>
            <ArrowLeft size={16} /> Back to Members
          </Button>
        </div>
      </div>
    );
  }

  const sc          = statusConfig[user.status] ?? statusConfig.Unverify;
  const subActive   = subscription && new Date(subscription.endDate) >= new Date() && subscription.status === "active";
  const subExpired  = subscription && new Date(subscription.endDate) < new Date() && subscription.status === "active";
  const subStatus   = !subscription ? null : subscription.status === "cancelled" ? "cancelled" : subExpired ? "expired" : "active";

  const subStatusStyles: Record<string, string> = {
    active:    "bg-emerald-50 text-emerald-700 border-emerald-200",
    expired:   "bg-amber-50 text-amber-700 border-amber-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
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
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push(`/subscriptions/add?userId=${id}`)}
                  className="rounded-lg gap-2 py-2 px-4 h-9 h-9"
                >
                  <Armchair size={15} />
                  Assign Seat
                </Button>
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
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <div className="flex items-center gap-5">

            {/* Avatar */}
            <div className="shrink-0">
              {user.photo ? (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-100"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-800 text-white flex items-center justify-center text-2xl font-black">
                  {user.name[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* Name & info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{user.name}</h1>
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
              <p className="text-xs font-bold text-slate-800 capitalize">Join At</p>
              <p className="text-[13px] font-medium text-slate-600">{fmt(user.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ─ Left: Personal + Address + Notes ─ */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <SectionHeading icon={Users} title="Personal Info" />
              <div className="space-y-3.5">
                <HorizontalInfoRow label="Father" value={user.fatherName} />
                <HorizontalInfoRow label="Mother" value={user.motherName} />
                <HorizontalInfoRow label="DOB"    value={fmt(user.dob)} />
                <HorizontalInfoRow label="Age"    value={`${age(user.dob)}`} />
                <HorizontalInfoRow label="Gender" value={user.gender} />
                <HorizontalInfoRow label="Category" value={user.category} />
                <HorizontalInfoRow label="Marital" value={user.maritalStatus} />
                <HorizontalInfoRow label="Adhar"   value={user.adharNumber} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <SectionHeading icon={MapPin} title="Address" />
              <div className="space-y-4">
                <div className="text-slate-700 leading-relaxed font-medium">
                  <p className="text-sm font-semibold text-slate-800 mb-1.5">Primary Residence</p>
                  <p className="text-base font-medium text-slate-700/90">{user.address.detailedAddress}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    <span className="text-sm font-semibold">{user.address.district}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Home size={18} className="text-slate-400" />
                    <span className="text-sm font-semibold">{user.address.state}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Hash size={18} className="text-slate-400" />
                    <span className="text-sm font-semibold text-slate-800">{user.address.pincode}</span>
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Photo + Signature Row */}
            <div className="grid grid-cols-2 gap-5">
              {/* Photo */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <SectionHeading icon={User} title="Photo" />
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt={`${user.name} photo`}
                    className="w-full h-60 object-cover rounded-xl border border-gray-100"
                  />
                ) : (
                  <div className="w-full h-60 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
                    <User size={28} className="text-gray-300" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No photo</p>
                  </div>
                )}
              </div>

              {/* Signature */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <SectionHeading icon={BadgeCheck} title="Signature" />
                {user.signature ? (
                  <div className="w-full h-60 bg-gray-50 rounded-xl border border-gray-100 p-4 flex items-center justify-center">
                    <img src={user.signature} alt="Signature" className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="w-full h-60 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
                    <BadgeCheck size={28} className="text-gray-300" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No signature</p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {user.notes && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <SectionHeading icon={FileText} title="Internal Notes" />
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                  <p className="text-sm text-amber-900 font-medium leading-relaxed whitespace-pre-wrap">{user.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* ─ Right Sidebar: Critical business data first ─ */}
          <div className="space-y-6">

            {/* Subscription & Seat */}
            {/* ── Seat Card (only if subscribed) ── */}
            {subscription && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <SectionHeading icon={Armchair} title="Seat" />
                <div className="space-y-2.5">
                  <HorizontalInfoRow label="Seat Number" value={subscription.seatId.seatNumber} />
                  <HorizontalInfoRow label="Seat Type"   value={subscription.seatId.type} />
                  <HorizontalInfoRow label="Seat Floor"  value={subscription.seatId.floor} />
                  <HorizontalInfoRow label="Seat Status" value={<StatusBadge status={subscription.seatId.status ?? "available"} size="xs" />} />
                </div>
              </div>
            )}

            {/* ── Subscription Card ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <SectionHeading icon={Clock} title="Subscription" />

              {subscription ? (
                <>
                  <div className="space-y-2.5">
                    <HorizontalInfoRow label="Status" value={<StatusBadge status={subscription.status ?? "active"} size="xs" />} />
                    <HorizontalInfoRow label="Start"  value={fmt(subscription.startDate)} />
                    <HorizontalInfoRow label="Expiry" value={<span className={subExpired ? "text-red-600" : ""}>{fmt(subscription.endDate)}</span>} />
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
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Armchair size={24} className="text-gray-400" />
                  </div>
                  <p className="font-bold text-gray-400 text-sm">No active subscription</p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push(`/subscriptions/add?userId=${id}`)}
                    className="rounded-xl"
                  >
                    Assign Seat
                  </Button>
                </div>
              )}
            </div>

            {/* Latest Payment */}
            {payment && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <SectionHeading icon={CreditCard} title="Latest Payment" />

                <div className="space-y-2.5">
                  <HorizontalInfoRow label="Amount"   value={<span className="font-black text-slate-900">₹{payment.amount}</span>} />
                  <HorizontalInfoRow label="Mode"     value={payment.paymentMode} />
                  <HorizontalInfoRow label="Receipt"  value={payment.receiptNumber} />
                  <HorizontalInfoRow label="Duration" value={`${payment.durationDays} days`} />
                  <HorizontalInfoRow label="Date"     value={fmt(payment.createdAt)} />
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
