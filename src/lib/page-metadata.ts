import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

type PageKey = "about" | "services" | "portfolio" | "pricing" | "contact" | "faq" | "privacy" | "terms" | "refund";

export async function getPageMetadata(
  locale: string,
  page: PageKey,
): Promise<Metadata> {
  const dict = await getDictionary(locale as Locale);
  const meta = dict.pageMeta[page];

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      siteName: "Brand Lab",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: `/${locale}/${page === "faq" ? "faq" : page}`,
      languages: {
        en: `/en/${page}`,
        ar: `/ar/${page}`,
      },
    },
  };
}
