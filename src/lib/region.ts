export type Region = "EG" | "INT";

/**
 * Returns the visitor's ISO country code from hosting/CDN geo headers.
 * Cloudflare is checked first: when it proxies the site, Vercel only sees
 * Cloudflare's edge IP (often in Europe), so its own header is wrong.
 */
export function getCountryFromHeaders(headers: Headers): string | null {
  const country =
    headers.get("cf-ipcountry") ||
    headers.get("x-vercel-ip-country") ||
    headers.get("cloudfront-viewer-country");
  if (!country || country === "XX" || country === "T1") return null;
  return country.toUpperCase();
}

export function regionFromCountry(country: string | null): Region {
  return country === "EG" ? "EG" : "INT";
}
