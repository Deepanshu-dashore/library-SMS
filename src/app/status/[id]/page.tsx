import { Metadata } from "next";
// This is a server component that renders the client-side StatusContent
import StatusContent from "./StatusContent";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  
  return {
    title: `Application Status - ${id.slice(-8).toUpperCase()}`,
    description: `Track the membership registration status for application #${id.slice(-8).toUpperCase()} at Shree Sawariya Library.`,
    openGraph: {
      title: "Track Your Library Membership Status",
      description: `Checking status for Application #${id.slice(-8).toUpperCase()}. Real-time updates on seat allocation and verification.`,
      url: `https://www.sawariyalibrary.in/status/${id}`,
      images: [
        {
          url: "/Bulding.webp",
          width: 1200,
          height: 630,
          alt: "Status Tracking - Shree Sawariya Library",
        },
      ],
    },
  };
}

export default function Page() {
  return <StatusContent />;
}
