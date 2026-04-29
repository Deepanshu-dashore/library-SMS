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
  const [downloading, setDownloading] = useState(false);
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
    if (!data || downloading) return;
    setDownloading(true);
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
        doc.rect(20, 15, 20, 20, 'F');
        doc.addImage(logoData, 'PNG', 20, 15, 20, 20, undefined, 'FAST');
      }

      doc.setFontSize(20);
      doc.setTextColor(17, 24, 39);
      doc.setFont('helvetica', 'bold'); // Font: Barlow
      doc.text(library?.name || "Library Management System", 43, 23);

      doc.setFillColor(49, 44, 133);
      doc.rect(40, 28, 150, 6, 'F');
      doc.setFontSize(8);
      doc.setTextColor(255);
      doc.text(library?.address || "Smart Library Management System", 42, 32);

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
      doc.setLineWidth(0.1);
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
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <SimpleLoader text="Verifying Receipt..." />;

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#00cb96] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-rose-500 w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
          <p className="text-gray-500 mb-8">This receipt link is invalid or has expired.</p>
          <Button variant="primary" className="w-full py-4 rounded-2xl" onClick={() => window.location.href = '/'}>Go to Homepage</Button>
        </div>
      </div>
    );
  }

  const { payment, library } = data;

  return (
    <div className="min-h-screen bg-[#00cb96] flex items-center justify-center p-4 sm:p-10 font-sans">
      {/* Wrapper for shadow since clip-path cuts off regular box-shadow */}
      <div className="w-full max-w-[450px] filter drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
        <div 
          className="bg-white flex flex-col pt-16 pb-16 px-8 overflow-hidden"
          style={{ 
            clipPath: 'polygon(0% 12px, 2.5% 0px, 5% 12px, 7.5% 0px, 10% 12px, 12.5% 0px, 15% 12px, 17.5% 0px, 20% 12px, 22.5% 0px, 25% 12px, 27.5% 0px, 30% 12px, 32.5% 0px, 35% 12px, 37.5% 0px, 40% 12px, 42.5% 0px, 45% 12px, 47.5% 0px, 50% 12px, 52.5% 0px, 55% 12px, 57.5% 0px, 60% 12px, 62.5% 0px, 65% 12px, 67.5% 0px, 70% 12px, 72.5% 0px, 75% 12px, 77.5% 0px, 80% 12px, 82.5% 0px, 85% 12px, 87.5% 0px, 90% 12px, 92.5% 0px, 95% 12px, 97.5% 0px, 100% 12px, 100% calc(100% - 12px), 97.5% 100%, 95% calc(100% - 12px), 92.5% 100%, 90% calc(100% - 12px), 87.5% 100%, 85% calc(100% - 12px), 82.5% 100%, 80% calc(100% - 12px), 77.5% 100%, 75% calc(100% - 12px), 72.5% 100%, 70% calc(100% - 12px), 67.5% 100%, 65% calc(100% - 12px), 62.5% 100%, 60% calc(100% - 12px), 57.5% 100%, 55% calc(100% - 12px), 52.5% 100%, 50% calc(100% - 12px), 47.5% 100%, 45% calc(100% - 12px), 42.5% 100%, 40% calc(100% - 12px), 37.5% 100%, 35% calc(100% - 12px), 32.5% 100%, 30% calc(100% - 12px), 27.5% 100%, 25% calc(100% - 12px), 22.5% 100%, 20% calc(100% - 12px), 17.5% 100%, 15% calc(100% - 12px), 12.5% 100%, 10% calc(100% - 12px), 7.5% 100%, 5% calc(100% - 12px), 2.5% 100%, 0% calc(100% - 12px))' 
          }}
        >
          {/* Header: ID and Date
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10">
            <span>Order: #{payment.receiptNumber}</span>
           <span>{new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div> */}

        {/* Central Illustration: Payment.webp */}
        <div className="flex flex-col items-center mb-8 text-center">
           <div className="w-48 h-40 relative mb-0 overflow-hidden rounded-2xl">
              <img src="/PaymentIllu.webp" className="w-full h-full object-cover" alt="Payment Illustration" />
           </div>
           <h2 className="md:text-2xl text-xl font-barlow font-bold text-[#036d61] capitalize! mb-2">{library.name}</h2>
           <h1 className="text-lg font-semibold text-gray-800 text-center leading-tight tracking-tight">Payment Receipt</h1>
        </div>

        {/* Payment Summary Table */}
        <div className="">
           <h3 className="text-[11px] font-bold text-gray-700  border-b border-gray-100 pb-2">Payment Summary</h3>
           
           <table className="w-full">
              <tbody className="divide-y divide-gray-50">
                 <tr>
                    <td className="py-2">
                       <div className="flex items-center gap-1">
                          <span className="text-sm font-barlow font-bold text-gray-800">Seat {payment.subscriptionId.seatId.seatNumber}</span>
                          <span className="text-gray-600 font-semibold text-xs uppercase">({payment.subscriptionId.seatId.type})</span>
                       </div>
                    </td>
                    <td className="py-2 text-right font-barlow" colSpan={2}>
                       <span className="text-xs font-medium text-gray-700">
                          Subscription: {new Date(payment.subscriptionId.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - {new Date(payment.subscriptionId.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                       </span>
                    </td>
                 </tr>
              </tbody>
           </table>

           {/* Total Section */}
           <div className="mt-1 py-1 border-t border-dashed border-gray-200">
              <div className="flex justify-between items-center">
                 <span className="text-sm font-semibold text-gray-900">Amount Paid</span>
                 <span className="text-xl font-bold font-barlow text-[#0c6b60]">₹{payment.amount}</span>
              </div>
           </div>
        </div>

        {/* Bottom Action Area: Replacing Barcode with Button */}
        <div className="mt-auto pt-8 border-t-2 border-dashed border-gray-100 flex flex-col items-center">
           <Button 
             onClick={handleDownloadPDF}
             isLoading={downloading}
             className="w-full py-3 rounded-2xl bg-gray-900 hover:bg-black text-white flex flex-col items-center justify-center gap-1 shadow-2xl transition-all active:scale-[0.98] group"
           >
              <div className="flex items-center gap-2">
                 <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                 <span className="text-lg font-semibold font-barlow">Download Receipt</span>
              </div>
           </Button>

           <div className="mt-5 flex items-center justify-center gap-2 text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase">Link valid for 24 hours</span>
           </div>
        </div>

      </div>
      </div>
    </div>
  );
}
