import { NextResponse } from "next/server";

export async function GET() {
  const robotsTxt = `User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /checkout
Disallow: /profile
Disallow: /orders
Disallow: /myaccount
Disallow: /address
Disallow: /quotation
Disallow: /qoutation
Disallow: /qoutation-checkout
Disallow: /quotation-checkout
Allow: /

Sitemap: https://e-rentals.in/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
