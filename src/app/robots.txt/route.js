import { NextResponse } from "next/server";

export async function GET() {
  const robotsTxt = `
User-agent: *
Disallow: /admin/
Allow: /

Sitemap: https://e-rentals.in/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
