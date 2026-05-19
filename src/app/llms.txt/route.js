import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";

export async function GET() {
  let categoriesText = "";
  try {
    const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      next: { revalidate: 3600 },
    });
    if (categoriesRes.ok) {
      const categoriesData = await categoriesRes.json();
      const categories = categoriesData?.categories || [];
      if (categories.length > 0) {
        categoriesText = "## Equipment Categories\n" + categories.map((cat) => 
          `- [${cat.name}](${BASE_URL}/categories/${cat.slug}): Rent premium ${cat.name} in Mumbai.`
        ).join("\n") + "\n\n";
      }
    }
  } catch (err) {
    console.error("llms.txt category fetch error:", err);
  }

  let servicesText = "";
  try {
    const servicesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services?limit=100`, {
      next: { revalidate: 3600 },
    });
    if (servicesRes.ok) {
      const servicesData = await servicesRes.json();
      const services = servicesData?.services || [];
      if (services.length > 0) {
        servicesText = "## Event Services\n" + services.map((service) => 
          `- [${service.title || service.name}](${BASE_URL}/services/${service.slug})`
        ).join("\n") + "\n\n";
      }
    }
  } catch (err) {
    console.error("llms.txt services fetch error:", err);
  }

  const llmsTxt = `# e-Rentals

> Premium Event & Party Equipment Rental in Mumbai

e-Rentals.in is Mumbai's leading provider for comprehensive event and party rentals. We offer high-quality furniture, sound systems, lighting, appliances, tents, stages, and decor on rent for hassle-free events at affordable daily rates.

## Core Information
- **Website:** ${BASE_URL}
- **Location:** Mumbai, Maharashtra, 400001, India
- **Phone:** +91 98673 48165
- **Email:** support@e-rentals.in
- **Operating Hours:** Monday to Sunday, 00:00 to 23:59

## Important Links
- [All Products](${BASE_URL}/products)
- [About Us](${BASE_URL}/about-us)
- [Contact Us](${BASE_URL}/contact-us)
- [Shipping & Delivery](${BASE_URL}/shipping-and-delivery)
- [FAQ](${BASE_URL}/faq)

${categoriesText}${servicesText}## Why Choose e-Rentals?
- Transparent Pricing & Easy Quotations
- Clean and Well-Maintained Inventory
- On-time Delivery across Mumbai
- End-to-End Setup & Teardown Services
`;

  return new NextResponse(llmsTxt, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=600"
    },
  });
}
