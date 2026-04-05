import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Brand Lab | Professional Video Editing & Montage Agency",
  description:
    "Brand Lab is a creative video editing and montage agency helping startups, freelancers, and content creators craft compelling visual stories that captivate audiences and elevate brands.",
  keywords: [
    "video editing",
    "montage",
    "content creation",
    "video production",
    "brand videos",
    "creative agency",
    "freelancer video editing",
    "startup video content",
  ],
  openGraph: {
    title: "Brand Lab | Professional Video Editing & Montage Agency",
    description:
      "Craft compelling visual stories that captivate audiences and elevate your brand.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
