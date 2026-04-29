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

  const handleDownloadPDF = async () => {
    if (!payment) return;
    
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Helper to get image as base64
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
      // Load all required images
      const [bgData, logoData, signData] = await Promise.all([
        getImageData('/Recipet.png'),
        getImageData(currentUser?.logo || currentUser?.photo || '/Logo.png'),
        getImageData(currentUser?.signature || '')
      ]);

      // 1. Background Image
      if (bgData) {
        doc.addImage(bgData, 'PNG', 0, 0, pageWidth, pageHeight);
      }

      // 2. Logo & Branding Header
      if (logoData) {
        // Square logo with amber background simulation
        doc.setFillColor(251, 191, 36); // Amber 400
        doc.rect(20, 15, 17, 17, 'F');
        doc.addImage(logoData, 'PNG', 20, 15, 17, 17, undefined, 'FAST');
      }

      doc.setFontSize(20);
      doc.setTextColor(17, 24, 39); // Gray 900
      doc.setFont('helvetica', 'bold');
      doc.text(currentUser?.name || "Library Management System", 40, 22);

      // Address badge in PDF
      doc.setFillColor(49, 44, 133); // #312c85
      doc.rect(40, 25, 150, 6, 'F');
      doc.setFontSize(8);
      doc.setTextColor(255);
      doc.text(currentUser?.address || "Smart Library Management System", 42, 29);

      // 3. Title
      doc.setFontSize(22);
      doc.setTextColor(49, 44, 133); // Indigo 900
      doc.setFont('helvetica', 'bold');
      const title = "PAYMENT RECEIPT";
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - titleWidth) / 2, 45);
      doc.setDrawColor(49, 44, 133);
      doc.setLineWidth(0.5);
      doc.line((pageWidth - titleWidth) / 2, 47, (pageWidth + titleWidth) / 2, 47);

      // 4. Receipt Meta
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

      // Divider
      doc.setDrawColor(230);
      doc.setLineWidth(0.1);
      doc.line(20, 72, 190, 72);

      // 5. Billed To
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

      // 6. Membership Details Title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Membership Details", 20, 115);

      // 7. Membership Details Table (using autoTable to align columns beautifully)
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

      // 8. Amount Paid
      const amountY = (doc as any).lastAutoTable.finalY + 15;
      doc.setDrawColor(245);
      doc.setLineWidth(0.5);
      doc.line(20, amountY - 7, 190, amountY - 7);
      
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.setFont('helvetica', 'bold');
      doc.text("Amount Paid :", 20, amountY);
      
      doc.setFontSize(18);
      doc.setTextColor(30, 27, 75); // Indigo 900
      doc.text(`${payment.amount} RS`, 60, amountY);
      
      doc.setDrawColor(245);
      doc.line(20, amountY + 5, 190, amountY + 5);

      // 9. Signature
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

      // 10. Note
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.setFont('helvetica', 'bold');
      doc.text("Note :", 20, 245);
      doc.setFont('helvetica', 'normal');
      doc.text("This is a system-generated receipt. For any corrections, please contact support.", 32, 245);

      // 11. Footer (Contact Information)
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.setFont('helvetica', 'bold');
      doc.text("Help Desk & Contact Information :", 20, 255);
      doc.line(20, 256, 75, 256);

      // Footer - Address row
      doc.setFontSize(8);
      doc.setTextColor(75);
      doc.setFont('helvetica', 'normal');
      
      const address = currentUser?.helpDesk?.address || currentUser?.address || "Slice 2, Phase 1, Scheme No. 78, Vijay Nagar, Indore, M.P.";
      doc.text(`Address: ${address}`, 20, 265);
      
      // Footer - Inline Contact row
      const email = currentUser?.helpDesk?.email || currentUser?.email || "helpdesk@library.com";
      const phone = currentUser?.helpDesk?.number || currentUser?.phone || currentUser?.phoneNumber || "+91 8305818506";
      const hours = currentUser?.helpDesk?.hours || "09:00 AM - 08:00 PM";
      
      doc.text(`Email: ${email}    |    Phone: ${phone}    |    Hours: ${hours}`, 20, 268);
      
      // Bottom border line for finish
      // doc.setDrawColor(30, 27, 75);
      // doc.setLineWidth(1.5);
      // doc.line(20, 275, 190, 275);

      window.open(doc.output('bloburl'), '_blank');
      doc.save(`Receipt_${payment.receiptNumber}.pdf`);
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    }
  };

  const [sendingEmail, setSendingEmail] = useState(false);

  const [sharing, setSharing] = useState(false);

  const handleShareReceipt = async () => {
    if (!payment) return;
    setSharing(true);
    try {
      const res = await fetch(`/api/payment/${id}/share-link`);
      const result = await res.json();
      
      if (result.success) {
        const url = result.link;
        const capitalizedName = payment.userId.name.replace(/\b\w/g, (l: string) => l.toUpperCase());
        const shareText = "*Payment Received:* ₹" + payment.amount.toLocaleString('en-IN') + " (Seat " + payment.subscriptionId.seatId.seatNumber + ")\n\n" +
                         "Hi " + capitalizedName + ", your payment has been successfully received.\n\n" +
                         "*Download receipt:*\n" + url + "\n\n" +
                         "Link valid for 24 hrs.";

        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Payment Receipt',
              text: shareText,
            });
          } catch (error) {
            navigator.clipboard.writeText(shareText);
            toast.success("Receipt link copied!");
          }
        } else {
          navigator.clipboard.writeText(shareText);
          toast.success("Receipt link copied!");
        }
      } else {
        toast.error(result.message || "Failed to generate share link");
      }
    } catch (error) {
      toast.error("An error occurred while sharing");
    } finally {
      setSharing(false);
    }
  };

  const handleSendEmail = async () => {
    if (!payment?.userId?.email) {
      toast.error("User doesn't have an email address");
      return;
    }

    setSendingEmail(true);
    try {
      const res = await fetch(`/api/payment/${id}/send-email`, {
        method: "POST",
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Receipt sent to email successfully!");
      } else {
        toast.error(result.message || "Failed to send email");
      }
    } catch (error) {
      toast.error("An error occurred while sending email");
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) return <SimpleLoader text="Generating Receipt" />;
  if (!payment)
    return (
      <div className="p-10 text-center font-black text-rose-500 bg-rose-50 rounded-2xl mx-10 mt-10">
        Receipt record not found
      </div>
    );

  return (
    <div className="selection:bg-gray-100 selection:text-gray-900">
      <div className="max-w-6xl">
        <PageHeader
          title="Payment Details"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Payments", href: "/payments" },
            { label: `Receipt #${payment.receiptNumber}` },
          ]}
          backLink="/payments"
          actionNode={
            <div className="flex gap-2">
              <Button
                onClick={handleShareReceipt}
                variant="outline"
                size="sm"
                isLoading={sharing}
                icon="solar:whatsapp-line-duotone"
                className="px-6 py-2.5 font-medium flex items-center gap-2 border-emerald-100 text-emerald-600 hover:bg-emerald-50"
              >
                Share Link
              </Button>
              <Button
                onClick={handleSendEmail}
                variant="secondary"
                size="sm"
                isLoading={sendingEmail}
                icon="solar:letter-line-duotone"
                className="px-6 py-2.5 font-medium flex items-center gap-2"
              >
                Email Receipt
              </Button>
              <Button
                onClick={handleDownloadPDF}
                variant="primary"
                size="sm"
                icon="solar:printer-line-duotone"
                // color="#111827"
                className="px-6 py-2.5 font-medium flex items-center gap-2"
              >
                {/* <Printer size={16} /> */}
                Print Receipt
              </Button>
            </div>
          }
        />

        {/* Premium Invoice for Printing (Hidden on screen, used for print) */}
        <div className="mt-10 flex flex-col items-center">
          {/* <div className="mb-4 flex items-center gap-2 text-gray-500 font-medium">
             <Icon icon="solar:document-text-bold-duotone" width={20} />
             <span>Premium Receipt Preview</span>
          </div> */}
          <div className="scale-75 origin-top border border-gray-100 rounded-sm">
             <Invoice payment={payment} owner={currentUser} />
          </div>
        </div>
      </div>
    </div>
  );
}

