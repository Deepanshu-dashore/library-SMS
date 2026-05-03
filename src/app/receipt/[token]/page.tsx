import { Metadata } from "next";
import ReceiptContent from "@/app/receipt/[token]/ReceiptContent";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Payment Receipt",
    description: "View and download your official membership payment receipt for Shree Sawariya Library.",
    openGraph: {
      title: "Digital Payment Receipt | Shree Sawariya Library",
      description: "Official library membership receipt. Thank you for being a part of our study community.",
      url: "https://www.sawariyalibrary.in/receipt",
      images: [
        {
          url: "/Bulding.webp",
          width: 1200,
          height: 630,
          alt: "Shree Sawariya Library Receipt",
        },
      ],
    },
  };
}

export default function Page() {
  return <ReceiptContent />;
}
