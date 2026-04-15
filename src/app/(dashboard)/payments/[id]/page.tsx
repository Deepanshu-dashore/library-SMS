"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Receipt, 
  User, 
  CreditCard, 
  Calendar, 
  BadgeCheck, 
  Download,
  Printer,
  ChevronLeft
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { Button } from "@/components/shared/Button";
import { SimpleLoader } from "@/components/shared/SimpleLoader";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PaymentDetails {
  _id: string;
  userId: { name: string, email: string, number: string };
  subscriptionId: {
    startDate: string;
    endDate: string;
    status: string;
  };
  amount: number;
  paymentMode: string;
  durationDays: number;
  receiptNumber: string;
  createdAt: string;
}

export default function ViewPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { currentUser } = useSelector((state: any) => state.user);
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await fetch(`/api/payment/${id}`);
        const result = await res.json();
        if (result.success) {
          setPayment(result.data);
        } else {
          toast.error(result.message || "Failed to load payment record");
        }
      } catch (error) {
        toast.error("An error occurred while fetching details");
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!payment) return;
    const doc = new jsPDF();
    
    // Header Branding
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129); // Emerald color
    doc.text("Library SMS", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Official Payment Receipt", 20, 28);
    
    // Invoice details (Right aligned)
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(`Invoice: INV-${payment.receiptNumber}`, 140, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`, 140, 26);
    doc.text(`Status: Paid`, 140, 32);

    // From and To
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text("From:", 20, 50);
    doc.text("To:", 110, 50);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text([
      currentUser?.name || "Library Office",
      "Digital Management System",
      `Email: ${currentUser?.email || "support@librarysms.com"}`,
      `Phone: ${currentUser?.number || "+91 98765 43210"}`
    ], 20, 57);
    doc.text([payment.userId.name, payment.userId.email, `Phone: ${payment.userId.number}`], 110, 57);

    // Items table
    autoTable(doc, {
      startY: 85,
      head: [["#", "Description", "Duration", "Amount"]],
      body: [
        ["1", "Monthly Library Subscription", `${payment.durationDays} Days`, `Rs. ${payment.amount.toLocaleString()}`]
      ],
      headStyles: { fillColor: [31, 41, 55] },
      margin: { top: 80 }
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont("Helvetica", "bold");
    doc.text(`Total Amount: Rs. ${payment.amount.toLocaleString()}`, 140, finalY);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("This is a computer-generated receipt. Support: support@librarysms.com", 20, 280);

    doc.save(`Receipt_${payment.receiptNumber}.pdf`);
  };

  if (loading) return <SimpleLoader text="Generating Receipt..." />;
  if (!payment) return <div className="p-10 text-center font-black text-rose-500 bg-rose-50 rounded-2xl mx-10 mt-10">Receipt record not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-public-sans selection:bg-gray-100 selection:text-gray-900">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <PageHeader 
          title="Payment Details"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Payments", href: "/payments" },
            { label: `Receipt #${payment.receiptNumber}` }
          ]}
          backLink="/payments"
          actionNode={
            <div className="flex gap-2">
               {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="bg-white hover:bg-gray-50 text-emerald-600 border-emerald-100"
                  >
                  <Download size={16} className="mr-2" />
                  Save PDF
               </Button> */}
               <Button
                  onClick={handleDownloadPDF}
                  variant="primary"
                  size="sm"
                  className="bg-gray-900 hover:bg-black text-white px-5"
               >
                  <Printer size={16} className="mr-2" />
                  Print
               </Button>
            </div>
          }
        />
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-none">
          <div className="p-8 md:p-12 space-y-12">
            
            {/* Header Section */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold italic shadow-sm">
                   <Icon icon="solar:library-bold-duotone" width={24} />
                </div>
                <div>
                   <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-none">Library SMS</h1>
                   <p className="text-[10px] text-gray-400 font-medium uppercase mt-1 tracking-wider">Management System</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold italic shadow-sm">
                   <Icon icon="solar:library-bold-duotone" width={24} />
                </div>
                <div>
                   <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-none">Library SMS</h1>
                   <p className="text-[10px] text-gray-400 font-medium uppercase mt-1 tracking-wider">Management System</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold italic shadow-sm">
                   <Icon icon="solar:library-bold-duotone" width={24} />
                </div>
                <div>
                   <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-none">Library SMS</h1>
                   <p className="text-[10px] text-gray-400 font-medium uppercase mt-1 tracking-wider">Management System</p>
                </div>
              </div>
              <div className="text-right space-y-2">
                 <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wide">
                    {payment.subscriptionId.status === 'active' ? 'Paid' : 'Completed'}
                 </span>
                 <h2 className="text-lg font-bold text-gray-900 leading-none">{payment.receiptNumber}</h2>
              </div>
            </div>

            {/* Address Grid */}
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-900">Invoice from</p>
                <div className="space-y-1">
                   <h4 className="font-bold text-gray-900 capitalize">{currentUser?.name || "Library Office"}</h4>
                   <p className="text-sm text-gray-500 leading-relaxed">
                     Digital Management System<br />
                     Email: {currentUser?.email || "support@librarysms.com"}<br />
                     Phone: {currentUser?.number || "+91 98765 43210"}
                   </p>
                </div>
              </div>
              <div className="space-y-4 text-right md:text-left">
                <p className="text-sm font-semibold text-gray-900">Invoice to</p>
                <div className="space-y-1">
                   <h4 className="font-bold text-gray-900">{payment.userId.name}</h4>
                   <p className="text-sm text-gray-500 leading-relaxed">
                     {payment.userId.email}<br />
                     Phone: {payment.userId.number}<br />
                     ID: {payment.userId.name.split(' ').join('_').toLowerCase()}_{payment._id.slice(-4)}
                   </p>
                </div>
              </div>
            </div>

            {/* Date Grid */}
            <div className="grid grid-cols-2 gap-12 border-t border-gray-50 pt-8 mt-8">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">Date create</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(payment.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="space-y-1 text-right md:text-left">
                <p className="text-sm font-semibold text-gray-900">Validity Until</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(payment.subscriptionId.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mt-12 overflow-hidden">
               <table className="w-full text-sm">
                  <thead className="bg-gray-50/80 border-y border-gray-100">
                     <tr>
                        <th className="px-4 py-3 text-left font-bold text-gray-400 uppercase tracking-widest text-[10px] w-12">#</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-400 uppercase tracking-widest text-[10px]">Description</th>
                        <th className="px-4 py-3 text-right font-bold text-gray-400 uppercase tracking-widest text-[10px]">Days</th>
                        <th className="px-4 py-3 text-right font-bold text-gray-400 uppercase tracking-widest text-[10px]">Unit price</th>
                        <th className="px-4 py-3 text-right font-bold text-gray-400 uppercase tracking-widest text-[10px]">Total</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 border-b border-gray-100">
                     <tr>
                        <td className="px-4 py-5 text-gray-900 font-medium">1</td>
                        <td className="px-4 py-5">
                           <p className="font-bold text-gray-900">Monthly Library Subscription</p>
                           <p className="text-gray-400 text-xs mt-1">Full access to reading area with allocated seat.</p>
                        </td>
                        <td className="px-4 py-5 text-right text-gray-600">{payment.durationDays}</td>
                        <td className="px-4 py-5 text-right text-gray-600">₹{payment.amount.toLocaleString()}</td>
                        <td className="px-4 py-5 text-right text-gray-900 font-bold">₹{payment.amount.toLocaleString()}</td>
                     </tr>
                  </tbody>
               </table>
            </div>

            {/* Calculations Section */}
            <div className="flex justify-end pt-8">
               <div className="w-full max-w-xs space-y-3">
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-400 font-medium">Subtotal</span>
                     <span className="text-gray-900 font-bold">₹{payment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-400 font-medium tracking-tight">Tax (GST 0%)</span>
                     <span className="text-gray-900 font-bold">₹0.00</span>
                  </div>
                  <div className="flex justify-between text-lg pt-4 border-t border-gray-100">
                     <span className="text-gray-900 font-bold">Total</span>
                     <span className="text-gray-900 font-black tracking-tight">₹{payment.amount.toLocaleString()}</span>
                  </div>
               </div>
            </div>

            {/* Footer Notes */}
            <div className="grid grid-cols-2 gap-12 pt-16 mt-16 border-t border-gray-50">
               <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-900 uppercase">NOTES</p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                     Thank you for your membership. This is a computer-generated receipt. Please reach out if you need tax details.
                  </p>
               </div>
               <div className="text-right space-y-1">
                  <p className="text-xs font-bold text-gray-900">Have a question?</p>
                  <p className="text-xs text-indigo-600 font-bold">support@librarysms.com</p>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

