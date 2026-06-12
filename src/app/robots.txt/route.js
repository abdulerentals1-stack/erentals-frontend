import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";

export async function GET() {
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
