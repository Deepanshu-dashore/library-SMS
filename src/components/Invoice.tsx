import React from "react";
import Image from "next/image";
import { format } from "date-fns";

interface InvoiceProps {
  payment: any;
  owner?: any;
}

export const Invoice: React.FC<InvoiceProps> = ({ payment, owner }) => {
  if (!payment) return null;

  const { userId, subscriptionId, amount, paymentMode, receiptNumber, createdAt } = payment;
  const seat = subscriptionId?.seatId;

  return (
    <div className="invoice-container w-[210mm] h-[297mm] bg-white relative overflow-hidden shadow-2xl mx-auto print:shadow-none print:m-0" id="invoice-capture">
      {/* Background Template */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/Recipet.png" 
          alt="Template" 
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full p-[15mm] flex flex-col font-public-sans text-gray-800 border-gray-200! outline-none! border">
        
        {/* Header: Logo */}
        <div className="flex justify-start mb-10 px-4">
          <div className="flex items-center gap-2">
          <div className="relative w-20 h-20 bg-amber-400">
            <Image 
              src={owner?.logo || owner?.photo || "/Logo.png"} 
              alt="Logo" 
              fill
              className="object-contain object-left"
            />
          </div>
                <div className="flex flex-col ml-4">
                   <h1 className="text-3xl font-bold text-gray-900 capitalize tracking-tight leading-none">{owner?.name||"Library Management System"}</h1>
                   <p className="text-sm px-2 font-semibold mt-1.5 text-white p-1.5 tracking-wider bg-indigo-900 w-full">{owner?.address||"Smart Library Management System"}</p>
                </div>
              </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-2">
          <h1 className="text-2xl font-bold text-indigo-900 border-b-2 border-double border-indigo-900 inline-block px-0 pb-0.5">
            PAYMENT
          </h1>
          <h1 className="text-2xl font-bold text-indigo-900 border-b-2 border-double border-indigo-900 inline-block px-0 pb-0.5">
            RECEIPT
          </h1>
          </div>
        </div>


        {/* Receipt Meta */}
        <div className="flex justify-between items-center mb-6 px-4">
          <div className="flex gap-2">
            <span className="font-bold text-gray-900">REC -</span>
            <span className="text-gray-700 font-barlow font-medium">{receiptNumber}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-gray-900">Generated On -</span>
            <span className="text-gray-700 font-barlow font-medium">{format(new Date(createdAt), "dd MMM yyyy")}</span>
          </div>
        </div>


        {/* Billed To */}
        <div className="px-4 mb-10">
          <div className="h-px bg-gray-200/90 w-full mb-2 text-transparent">.</div>
          <p className="text-sm font-semibold text-gray-500 mb-2">Billed To :</p>
          <h2 className="text-2xl font-bold text-gray-900">{userId?.name}</h2>
          <div className="h-px bg-gray-200/90 w-full mt-2"></div>
        </div>

        {/* Membership Details */}
        <div className="px-4 mb-10">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Membership Details</h3>
          
          <div className="space-y-4 max-w-lg">
            <div className="grid grid-cols-[200px_min-content_1fr] items-center gap-4">
              <span className="font-bold text-gray-900">Seat Number (Type)</span>
              <span>:</span>
              <span className="text-gray-700">{seat?.seatNumber} ({seat?.type?.toUpperCase()})</span>
            </div>
            
            <div className="grid grid-cols-[200px_min-content_1fr] items-center gap-4">
              <span className="font-bold text-gray-900">Floor</span>
              <span>:</span>
              <span className="text-gray-700 text-sm font-semibold">{seat?.floor || "Ground"}</span>
            </div>

            <div className="grid grid-cols-[200px_min-content_1fr] items-center gap-4">
              <span className="font-bold text-gray-900">Payment Method</span>
              <span>:</span>
              <span className="text-gray-700 capitalize">{paymentMode}</span>
            </div>

            <div className="grid grid-cols-[200px_min-content_1fr] items-center gap-4">
              <span className="font-bold text-gray-900">Payment Date</span>
              <span>:</span>
              <span className="text-gray-700">{format(new Date(createdAt), "dd MMM yyyy")}</span>
            </div>

            <div className="grid grid-cols-[200px_min-content_1fr] items-center gap-4">
              <span className="font-bold text-gray-900">Subscription Period</span>
              <span>:</span>
              <span className="text-gray-700">
                {format(new Date(subscriptionId?.startDate), "dd MMM yyyy")} To {format(new Date(subscriptionId?.endDate), "dd MMM yyyy")}
              </span>
            </div>
          </div>
        </div>

        {/* Amount Section */}
        <div className="px-4 py-4 border-y border-gray-200/90 flex items-center gap-8">
          <span className="text-xl font-bold text-gray-900">Amount Paid :</span>
          <span className="text-3xl font-bold font-barlow text-indigo-900 uppercase">{amount} rs</span>
        </div>

        {/* Signature Section */}
        <div className="px-4 mb-8">
          <div className="w-48 h-16 relative mb-2">
            {owner?.signature && (
              <Image 
                src={owner.signature} 
                alt="Signature" 
                fill
                className="object-contain object-left"
              />
            )}
          </div>
          <div className="w-56 border-t border-dotted border-gray-400 pt-2 text-center text-sm font-bold text-gray-800">
            Authorized Signature
          </div>
        </div>

        {/* Note */}
        <div className="px-4 mt-8 mb-6">
          <p className="text-sm text-gray-600">
            <span className="font-bold border-b border-gray-900">Note</span> : This is a system-generated receipt. For any corrections, please contact support.
          </p>
        </div>

        {/* Footer: Contact Information */}
        <div className="px-4 space-y-4 relative z-20 mb-10">
          <div className="flex gap-2">
          <h4 className="text-sm font-bold text-gray-900 border-b border-gray-900 inline-block">
            Help Desk
          </h4>
          <h4 className="text-sm font-bold text-gray-900 border-b border-gray-900 inline-block">
            &
          </h4>
          <h4 className="text-sm font-bold text-gray-900 border-b border-gray-900 inline-block">
            Contact Information :
          </h4>
          </div>
          
          <div className="flex items-center gap-x-6 text-[13px] text-gray-700 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="bg-gray-900 text-white rounded p-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <span>{owner?.helpDesk?.email || owner?.email || "helpdesk@library.com"}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-gray-900 text-white rounded p-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.88 12.88 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <span>{owner?.helpDesk?.number || owner?.phone || owner?.phoneNumber || "+91 8305818506"}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-gray-900 text-white rounded p-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <span>{owner?.helpDesk?.hours || "09:00 AM - 08:00 PM"}</span>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 297mm !important;
            width: 210mm !important;
          }
          body * {
            visibility: hidden !important;
          }
          .invoice-container, .invoice-container * {
            visibility: visible !important;
          }
          .invoice-container {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            z-index: 9999 !important;
          }
        }
      `}</style>
    </div>
  );
};
