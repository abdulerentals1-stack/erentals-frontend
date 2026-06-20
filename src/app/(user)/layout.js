import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "../../context/AuthContext";
import Navbar from "@/components/layouts/Navbar";
import TagsList from "@/components/user/TagsList";
import ToasterProvider from "@/components/user/ToasterProvider";
import Footer from "@/components/layouts/Footer";
import Script from "next/script";
import { GoogleTagManager } from '@next/third-parties/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";
const logoUrl =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/e-rental-logo.png` : "https://e-rentals.in/e-rental-logo.png";

export const metadata = {
  metadataBase: new URL(siteDomain),
  title: "Event & Party Equipment Rental in Mumbai | e-Rentals",
  description:
    "e-Rentals.in offers comprehensive event and party rentals in Mumbai, with furniture, sound systems, lighting, appliances, tents, stages and decor on rent for hassle-free events at affordable rates.",
  keywords: [
    "event rentals mumbai",
    "party rentals in mumbai",
    "furniture rental in mumbai",
    "sound system rental",
    "lighting rental in mumbai",
    "appliance rental",
    "tent rental",
    "stage rental",
    "decor rental",
    "furniture on rent",
    "rental services Mumbai",
    "eRentals",
  ],
  openGraph: {
    title: "Event & Party Equipment Rental in Mumbai | e-Rentals",
    description:
      "e-Rentals.in offers comprehensive event and party rentals in Mumbai, with furniture, sound systems, lighting, appliances, tents, stages and decor on rent for hassle-free events at affordable rates.",
    url: siteDomain + "/",
    siteName: "e-Rentals",
    images: [
      {
        url: typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg` : 'https://e-rentals.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "e-Rentals Logo and event rental services in Mumbai",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event & Party Equipment Rental in Mumbai | e-Rentals",
    description:
      "Event and party rentals in Mumbai — furniture, sound, lighting, tents, decor and more at affordable rates.",
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

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "e-Rentals",
        url: siteDomain,
        logo: logoUrl,
        description:
          "e-Rentals.in offers event and party rentals in Mumbai — furniture, sound, lighting, tents, stages and decor on rent for hassle-free events.",
      },
      {
        "@type": "WebSite",
        name: "e-Rentals",
        url: siteDomain,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteDomain}/product-search?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "EquipmentRentalAgency",
        "@id": `${siteDomain}/#localbusiness`,
        "name": "e-Rentals",
        "image": logoUrl,
        "telephone": "+91 98673 48165",
        "email": "support@e-rentals.in",
        "url": siteDomain,
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Mumbai",
          "addressLocality": "Mumbai",
          "addressRegion": "Maharashtra",
          "postalCode": "400001",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "19.0760",
          "longitude": "72.8777"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "00:00",
          "closes": "23:59"
        }
      }
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* ✅ Inject structured data for SEO */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleTagManager gtmId="GTM-N5GLP4RZ" />
        <AuthProvider>
          <ToasterProvider />
          <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <Navbar />
            <TagsList />

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
