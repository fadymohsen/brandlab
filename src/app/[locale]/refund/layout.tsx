import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, "refund");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
