import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yashwant Kirakte | Developer Portfolio",
  description:
    "A modern developer portfolio showcasing projects, skills, LeetCode activity, and contact information.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
