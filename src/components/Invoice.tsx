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
    <div className="invoice-container w-[210mm] h-[297mm] bg-white relative overflow-hidden shadow-sm mx-auto print:shadow-none print:m-0" id="invoice-capture">
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
          <div className="flex items-center">
          <div className="relative w-17 h-17 bg-amber-400 overflow-hidden">
            <Image 
              src={owner?.logo || owner?.photo || "/Logo.png"} 
              alt="Logo" 
              fill
              className="object-cover object-left"
            />
          </div>
                <div className="flex flex-col ml-2">
                   <h1 className="text-2xl font-bold text-gray-900 capitalize tracking-]wide leading-none">{owner?.name||"Library Management System"}</h1>
                   <p className="text-xs px-2 font-medium mt-1.5 text-white p-1.5 tracking-wider bg-[#312c85] w-full">{owner?.address||"Smart Library Management System"}</p>
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
          <div className="h-px bg-gray-200/60 w-full mb-2 text-transparent">.</div>
          <p className="text-sm font-semibold text-gray-500 mb-2">Billed To :</p>
          <h2 className="text-2xl capitalize font-bold text-gray-900">{userId?.name}</h2>
          <div className="h-px bg-gray-200/60 w-full mt-2"></div>
        </div>

        {/* Membership Details */}
        <div className="px-4 mb-10">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Membership Details</h3>
          
          <div className="space-y-4 max-w-lg">
            <div className="grid grid-cols-[200px_min-content_1fr] items-center gap-4">
              <span className="font-bold text-gray-800">Seat Number (Type)</span>
              <span>:</span>
              <span className="text-gray-700">{seat?.seatNumber} ({seat?.type?.toUpperCase()})</span>
            </div>
            
            <div className="grid grid-cols-[200px_min-content_1fr] items-center gap-4">
              <span className="font-bold text-gray-800">Floor</span>
              <span>:</span>
              <span className="text-gray-700 capitalize">{seat?.floor || "Ground"}</span>
            </div>

            <div className="grid grid-cols-[200px_min-content_1fr] items-center gap-4">
              <span className="font-bold text-gray-800">Payment Method</span>
              <span>:</span>
              <span className="text-gray-700 capitalize">{paymentMode}</span>
            </div>

            <div className="grid grid-cols-[200px_min-content_1fr] items-center gap-4">
              <span className="font-bold text-gray-800">Payment Date</span>
              <span>:</span>
              <span className="text-gray-700">{format(new Date(createdAt), "dd MMM yyyy")}</span>
            </div>

            <div className="grid grid-cols-[200px_min-content_1fr] items-center gap-4">
              <span className="font-bold text-gray-800">Subscription Period</span>
              <span>:</span>
              <span className="text-gray-700">
                {format(new Date(subscriptionId?.startDate), "dd MMM yyyy")} To {format(new Date(subscriptionId?.endDate), "dd MMM yyyy")}
              </span>
            </div>
          </div>
        </div>

        {/* Amount Section */}
        <div className="px-4 py-4 border-y border-gray-200/90 flex items-end gap-8">
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
            <span className="font-bold border-b border-gray-400">Note</span> : This is a system-generated receipt. For any corrections, please contact support.
          </p>
        </div>

        {/* Footer: Contact Information */}
        <div className="px-4 space-y-4 relative z-20 mb-10">
          <div className="flex gap-2">
          <h4 className="text-sm font-bold text-gray-900 border-b border-gray-300 inline-block">
            Help Desk
          </h4>
          <h4 className="text-sm font-bold text-gray-900 border-b border-gray-300 inline-block">
            &
          </h4>
          <h4 className="text-sm font-bold text-gray-900 border-b border-gray-300 inline-block">
            Contact Information :
          </h4>
          </div>
          
          <div className="flex items-center gap-x-6 text-[13px] text-gray-900 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="text-indigo-900 p-0.5">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20">
	<path fill="currentColor" d="M18 7.373V14.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 2 14.5V7.373l7.746 4.558a.5.5 0 0 0 .508 0zM15.5 4a2.5 2.5 0 0 1 2.485 2.223L10 10.92L2.015 6.223A2.5 2.5 0 0 1 4.5 4z" />
</svg>
              </div>
              <span>{owner?.helpDesk?.email || owner?.email || "helpdesk@library.com"}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-indigo-900 p-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
	<path fill="currentColor" fillRule="evenodd" d="m16.1 13.359l.456-.453c.63-.626 1.611-.755 2.417-.317l1.91 1.039c1.227.667 1.498 2.302.539 3.255l-1.42 1.412c-.362.36-.81.622-1.326.67c-1.192.111-3.645.051-6.539-1.643zm-5.91-5.876l.287-.286c.707-.702.774-1.83.157-2.654L9.374 2.86C8.61 1.84 7.135 1.705 6.26 2.575l-1.57 1.56c-.433.432-.723.99-.688 1.61c.065 1.14.453 3.22 2.149 5.776z" clipRule="evenodd" />
	<path fill="currentColor" d="M12.063 11.497c-2.946-2.929-1.88-4.008-1.873-4.015l-4.039 4.04c.667 1.004 1.535 2.081 2.664 3.204c1.14 1.134 2.26 1.975 3.322 2.596L16.1 13.36s-1.082 1.076-4.037-1.862" opacity="0.6" />
</svg>
              </div>
              <span>{owner?.helpDesk?.number || owner?.phone || owner?.phoneNumber || "+91 8305818506"}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-indigo-900 p-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20">
	<g fill="currentColor">
		<g opacity={0.2}>
			<path d="M18.5 11a7 7 0 1 1-14 0a7 7 0 0 1 14 0"></path>
			<path fillRule="evenodd" d="M11.5 16a5 5 0 1 0 0-10a5 5 0 0 0 0 10m0 2a7 7 0 1 0 0-14a7 7 0 0 0 0 14" clipRule="evenodd"></path>
		</g>
		<path fillRule="evenodd" d="M5.604 5.45a6.44 6.44 0 0 0-1.883 5.278a.5.5 0 0 1-.994.105a7.44 7.44 0 0 1 2.175-6.096c2.937-2.897 7.675-2.85 10.582.098s2.888 7.685-.05 10.582a7.43 7.43 0 0 1-5.097 2.142a7.5 7.5 0 0 1-2.14-.271a.5.5 0 0 1 .266-.964a6.5 6.5 0 0 0 1.856.235a6.42 6.42 0 0 0 4.413-1.854c2.541-2.506 2.562-6.61.04-9.168s-6.627-2.594-9.168-.088" clipRule="evenodd"></path>
		<path fillRule="evenodd" d="M3.594 11.363a.5.5 0 0 1-.706.04l-1.72-1.53a.5.5 0 1 1 .664-.746l1.72 1.53a.5.5 0 0 1 .042.706" clipRule="evenodd"></path>
		<path fillRule="evenodd" d="M2.82 11.3a.5.5 0 0 0 .7.1l2-1.5a.5.5 0 1 0-.6-.8l-2 1.5a.5.5 0 0 0-.1.7M10 6.5a.5.5 0 0 1 .5.5v3.5a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5" clipRule="evenodd"></path>
		<path fillRule="evenodd" d="M13.5 10.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5" clipRule="evenodd"></path>
	</g>
</svg>
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
