import { Card, CardContent } from "@/components/ui/card";
import Script from "next/script";

const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";
const logoUrl = typeof process !== "undefined" && process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/e-rental-logo.png` : "https://e-rentals.in/e-rental-logo.png";

export const metadata = {
  metadataBase: new URL(siteDomain),
  title: "About Us – eRentals | Event Rentals & Equipment Hire Mumbai",
  description:
    "eRentals is Mumbai’s leading event rental platform — offering furniture, lighting, sound, decor, tents, stages & more. Trusted, convenient & quality rentals in Mumbai",
  keywords: [
    "affordable party rental services Mumbai",
    "tent and stage setup on rent Mumbai",
    "exhibition & expo rentals Mumbai",
    "one-stop rental platform Mumbai",
    "corporate event rentals Mumbai",
  ],
  alternates: {
    canonical: `${siteDomain}/about-us`,
  },
  openGraph: {
    title: "About Us – eRentals | Event Rentals & Equipment Hire Mumbai",
    description:
      "eRentals is Mumbai’s leading event rental platform — offering furniture, lighting, sound, decor, tents, stages & more. Trusted, convenient & quality rentals in Mumbai",
    url: `${siteDomain}/about-us`,
    siteName: "e-Rentals",
    images: [
      {
        url: typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg` : 'https://e-rentals.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "e-Rentals Logo - About Us",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us – eRentals | Event Rentals & Equipment Hire Mumbai",
    description:
      "eRentals is Mumbai’s leading event rental platform — offering furniture, lighting, sound, decor, tents, stages & more. Trusted, convenient & quality rentals in Mumbai",
    images: [typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg` : 'https://e-rentals.in/og-image.jpg'],
    creator: "@erentals",
  },
  icons: {
    icon: logoUrl,
    shortcut: logoUrl,
    apple: logoUrl,
  },
  other: {
    "theme-color": "#ffffff",
  },
};

  

export default function AboutUs() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Us – eRentals",
    description:
      "eRentals is Mumbai’s leading event rental platform — offering furniture, lighting, sound, decor, tents, stages & more. Trusted, convenient & quality rentals in Mumbai",
    url: `${siteDomain}/about-us`,
    publisher: {
      "@type": "Organization",
      name: "e-Rentals",
      logo: {
        "@type": "ImageObject",
        url: typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg` : 'https://e-rentals.in/og-image.jpg',
      },
    },
  };
  return (
    <section className="py-12 bg-gray-50">
      <Script
        id="about-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-5xl mx-auto px-4">
        <Card className="shadow-md border border-gray-200 rounded-2xl">
          <CardContent className="p-6 space-y-8">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-[#144169]">
                About e-Rentals – Mumbai's Event Rental Marketplace
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Erentals Hnd Private Limited is a cutting-edge online rental
                marketplace designed to seamlessly connect vendors with customers
                across the globe. Whether for weddings, exhibitions, corporate
                events, concerts, conferences, private parties, or personal
                needs—Erentals is your one-stop solution to access thousands of
                rental products with ease.
              </p>
            </div>

            {/* Revolutionizing Section */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Revolutionizing the Global Rental Ecosystem
              </h2>
              <p>
                Our platform empowers rental vendors to list their products, set
                pricing, and receive inquiries—all in one place. Customers can
                compare multiple vendor quotations, ensuring transparency and
                competitive pricing. Unlike traditional rental businesses,
                Erentals does not handle logistics, deliveries, or product
                quality—vendors are fully responsible for their offerings,
                creating an open and decentralized rental ecosystem.
              </p>
            </div>

            {/* Why Choose Erentals */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Why Choose e-Rentals?
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Endless Rental Possibilities –</strong> From event décor
                  and furniture to photography gear, electronics, and costumes.
                </li>
                <li>
                  <strong>Vendor-Centric Platform –</strong> List products, manage
                  leads, and generate invoices effortlessly.
                </li>
                <li>
                  <strong>Transparent Pricing –</strong> Compare multiple vendors
                  and choose the best option.
                </li>
                <li>
                  <strong>Global Reach –</strong> Find rental services across
                  different cities and regions worldwide.
                </li>
                <li>
                  <strong>One-Click Quotations & Invoices –</strong> Streamline the
                  rental process with instant document generation.
                </li>
              </ul>
            </div>

            {/* How Erentals Empowers Vendors */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                How e-Rentals Empowers Vendors
              </h2>
              <p>
                Running a rental business has never been easier. Our
                technology-driven approach enables vendors to scale their
                business effortlessly:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>✅ Verified Customer Leads –</strong> Connect with
                  customers actively searching for rentals.
                </li>
                <li>
                  <strong>✅ Automated Quotation System –</strong> Create and share
                  quotes instantly.
                </li>
                <li>
                  <strong>✅ Smart Invoicing & Order Management –</strong> Generate
                  professional invoices and notify customers automatically.
                </li>
                <li>
                  <strong>✅ Comprehensive Vendor Profiles –</strong> Showcase
                  listings, reviews, and success stories.
                </li>
              </ul>
            </div>

            {/* Vision & Mission */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Our Vision & Mission
              </h2>
              <p>
                At Erentals Hnd Private Limited, we believe in creating a world
                where renting is as simple as one click. Our mission is to
                empower rental vendors while providing customers with a
                transparent, effortless, and worry-free experience—be it setting
                up an event, furnishing office space, or renting specialized
                equipment.
              </p>
            </div>

            {/* Future of Renting */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                The Future of Renting Starts Here
              </h2>
              <p>
                Renting should be easy, flexible, and accessible to everyone.
                With Erentals, you no longer need to waste time searching for
                the right provider. Our platform ensures both vendors and
                customers enjoy a seamless, efficient, and rewarding rental
                journey.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
