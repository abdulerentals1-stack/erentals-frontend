import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const host = request.headers.get("host") || "e-rentals.in";
  const protocol = host.includes("localhost") ? "http" : "https";
  const BASE_URL = `${protocol}://${host}`;

  const robotsTxt = `User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /checkout
Disallow: /quotation-checkout
Disallow: /myaccount/
Disallow: /orders/
Disallow: /profile/
Disallow: /address/
Disallow: /login
Disallow: /otp-login
Disallow: /otp-signup
Disallow: /reset-password/
Disallow: /verify/
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
