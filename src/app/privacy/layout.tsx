import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Shree Sawariya Library collects, uses, and protects your personal information.",
  openGraph: {
    title: "Privacy Policy | Shree Sawariya Library",
    description: "Your privacy is important to us. Read our privacy policy to understand how we handle your data.",
    url: "https://www.sawariyalibrary.in/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
