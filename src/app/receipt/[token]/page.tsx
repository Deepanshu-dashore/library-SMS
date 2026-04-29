"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import { Button } from "@/components/shared/Button";
import { SimpleLoader } from "@/components/shared/SimpleLoader";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Invoice } from "@/components/Invoice";

interface PaymentDetails {
  _id: string;
  userId: { name: string, email: string, number: string };
  subscriptionId: {
    startDate: string;
    endDate: string;
    status: string;
    seatId: {
      seatNumber: string;
      type: string;
      floor?: string;
    };
  };
  amount: number;
  paymentMode: string;
  durationDays: number;
  receiptNumber: string;
  createdAt: string;
}

interface LibraryDetails {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
  signature: string;
  helpDesk?: {
    address?: string;
    email?: string;
    number?: string;
    hours?: string;
  };
}

export default function PublicReceiptPage() {
  const params = useParams();
  const token = params.token as string;
  
  const [data, setData] = useState<{ payment: PaymentDetails; library: LibraryDetails } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await fetch(`/api/receipt/${token}`);
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || "Failed to load receipt");
        }
      } catch (err) {
        setError("An error occurred while fetching the receipt");
      } finally {
        setLoading(false);
      }
    };
    fetchReceipt();
  }, [token]);

  const handleDownloadPDF = async () => {
    if (!data) return;
    const { payment, library } = data;
    
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const getImageData = (url: string): Promise<string> => {
      return new Promise((resolve) => {
        const img = new (window as any).Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve('');
        img.src = url;
      });
    };

    try {
      const [bgData, logoData, signData] = await Promise.all([
        getImageData('/Recipet.png'),
        getImageData(library?.logo || '/Logo.png'),
        getImageData(library?.signature || '')
      ]);

      if (bgData) {
        doc.addImage(bgData, 'PNG', 0, 0, pageWidth, pageHeight);
      }

      if (logoData) {
        doc.setFillColor(251, 191, 36);
        doc.rect(20, 15, 17, 17, 'F');
        doc.addImage(logoData, 'PNG', 20, 15, 17, 17, undefined, 'FAST');
      }

      doc.setFontSize(20);
      doc.setTextColor(17, 24, 39);
      doc.setFont('helvetica', 'bold');
      doc.text(library?.name || "Library Management System", 40, 22);

      doc.setFillColor(49, 44, 133);
      doc.rect(40, 25, 150, 6, 'F');
      doc.setFontSize(8);
      doc.setTextColor(255);
      doc.text(library?.address || "Smart Library Management System", 42, 29);

      doc.setFontSize(22);
      doc.setTextColor(49, 44, 133);
      doc.setFont('helvetica', 'bold');
      const title = "PAYMENT RECEIPT";
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - titleWidth) / 2, 45);
      doc.setDrawColor(49, 44, 133);
      doc.setLineWidth(0.5);
      doc.line((pageWidth - titleWidth) / 2, 47, (pageWidth + titleWidth) / 2, 47);

      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text("REC -", 20, 65);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75);
      doc.text(payment.receiptNumber, 35, 65);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text("Generated On -", 130, 65);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75);
      doc.text(new Date(payment.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), 165, 65);

      doc.setDrawColor(230);
      doc.setLineWidth(0.1);
      doc.line(20, 72, 190, 72);

      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.setFont('helvetica', 'bold');
      doc.text("Billed To :", 20, 85);
      
      doc.setFontSize(20);
      doc.setTextColor(0);
      const capitalizedName = payment.userId.name.replace(/\b\w/g, (l: string) => l.toUpperCase());
      doc.text(capitalizedName, 20, 95);
      
      doc.setDrawColor(245);
      doc.setLineWidth(1);
      doc.line(20, 100, 190, 100);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Membership Details", 20, 115);

      const seat = payment.subscriptionId.seatId;
      autoTable(doc, {
        startY: 125,
        margin: { left: 20 },
        tableWidth: 160,
        body: [
          ["Seat Number (Type)", ":", `${seat?.seatNumber} (${seat?.type?.toUpperCase()})`],
          ["Floor", ":", `${seat?.floor || "Ground"}`],
          ["Payment Method", ":", `${payment.paymentMode.toUpperCase()}`],
          ["Payment Date", ":", `${new Date(payment.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`],
          ["Subscription Period", ":", `${new Date(payment.subscriptionId.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} To ${new Date(payment.subscriptionId.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`]
        ],
        theme: 'plain',
        styles: {
          fontSize: 11,
          cellPadding: 2,
          textColor: [75, 75, 75],
        },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: [0, 0, 0], cellWidth: 50 },
          1: { cellWidth: 5 },
          2: { cellWidth: 'auto' }
        }
      });

      const amountY = (doc as any).lastAutoTable.finalY + 15;
      doc.setDrawColor(245);
      doc.setLineWidth(0.5);
      doc.line(20, amountY - 7, 190, amountY - 7);
      
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.setFont('helvetica', 'bold');
      doc.text("Amount Paid :", 20, amountY);
      
      doc.setFontSize(18);
      doc.setTextColor(30, 27, 75);
      doc.text(`${payment.amount} RS`, 60, amountY);
      
      doc.setDrawColor(245);
      doc.line(20, amountY + 5, 190, amountY + 5);

      const signY = amountY + 25;
      if (signData) {
        doc.addImage(signData, 'PNG', 20, signY, 40, 12);
      }
      doc.setDrawColor(150);
      doc.setLineWidth(0.2);
      doc.setLineDashPattern([1, 1], 0);
      doc.line(20, signY + 15, 65, signY + 15);
      doc.setLineDashPattern([], 0);
      
      doc.setFontSize(9);
      doc.setTextColor(0);
      doc.setFont('helvetica', 'bold');
      doc.text("Authorized Signature", 26, signY + 20);

      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.setFont('helvetica', 'bold');
      doc.text("Note :", 20, 245);
      doc.setFont('helvetica', 'normal');
      doc.text("This is a system-generated receipt. For any corrections, please contact support.", 32, 245);

      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.setFont('helvetica', 'bold');
      doc.text("Help Desk & Contact Information :", 20, 255);
      doc.line(20, 256, 75, 256);

      doc.setFontSize(8);
      doc.setTextColor(75);
      doc.setFont('helvetica', 'normal');
      
      const address = library?.helpDesk?.address || library?.address || "Library Address";
      doc.text(`Address: ${address}`, 20, 265);
      
      const email = library?.helpDesk?.email || library?.email || "helpdesk@library.com";
      const phone = library?.helpDesk?.number || library?.phone || "+91 0000000000";
      const hours = library?.helpDesk?.hours || "09:00 AM - 08:00 PM";
      
      doc.text(`Email: ${email}    |    Phone: ${phone}    |    Hours: ${hours}`, 20, 268);
      
      window.open(doc.output('bloburl'), '_blank');
      doc.save(`Receipt_${payment.receiptNumber}.pdf`);
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    }
  };

  if (loading) return <SimpleLoader text="Verifying Receipt..." />;

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-rose-100">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-rose-500 w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid or Expired Link</h1>
          <p className="text-gray-500 mb-8">
            This receipt link is invalid or has expired after 24 hours. Please contact the library for a new link.
          </p>
          <Button 
            variant="primary" 
            className="w-full py-4 rounded-2xl font-semibold"
            onClick={() => window.location.href = '/'}
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  const { payment, library } = data;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
            <CheckCircle2 className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Payment Successful!
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Thank you for your payment. Your receipt is ready for download.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="text-indigo-600 w-5 h-5" />
                Receipt Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-500">Receipt No</span>
                  <span className="font-bold text-gray-900">#{payment.receiptNumber}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="text-2xl font-black text-indigo-600">₹{payment.amount}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium text-gray-700">{new Date(payment.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-500">Status</span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full uppercase tracking-wider">Completed</span>
                </div>
              </div>

              <Button 
                onClick={handleDownloadPDF}
                variant="primary"
                className="w-full mt-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-indigo-100 group"
              >
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                Download PDF Receipt
              </Button>
            </div>

            {/* Security Note */}
            <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 flex gap-4">
              <div className="flex-shrink-0">
                <Clock className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-indigo-900">Link Expiration</h3>
                <p className="text-sm text-indigo-700 mt-1">
                  For your security, this receipt link will expire in 24 hours. Please download your copy now.
                </p>
              </div>
            </div>
            
            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 flex gap-4">
              <div className="flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-900">Secure Payment</h3>
                <p className="text-sm text-emerald-700 mt-1">
                  This is an official digital receipt generated by {library.name}.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden h-full">
              <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preview</span>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                </div>
              </div>
              <div className="p-8 scale-[0.85] origin-top">
                <Invoice payment={payment} owner={library} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} {library.name}. All rights reserved.</p>
          <p className="mt-1">Powered by Library Management System</p>
        </div>
      </div>
    </div>
  );
}
