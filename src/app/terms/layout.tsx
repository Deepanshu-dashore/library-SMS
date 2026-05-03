import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Read the terms and conditions for using Shree Sawariya Library facilities and services.",
  openGraph: {
    title: "Terms and Conditions | Shree Sawariya Library",
    description: "Rules and regulations for members of Shree Sawariya Library, Khargone.",
    url: "https://www.sawariyalibrary.in/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
