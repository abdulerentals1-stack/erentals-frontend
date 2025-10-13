import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "../../context/AuthContext";
import Navbar from "@/components/layouts/Navbar";
import { Toaster } from "sonner";
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
  "https://blr1.vultrobjects.com/erental-object/378f01fe-2344-4c35-90d2-07dcd2236dd8.png";

export const metadata = {
  metadataBase: new URL(siteDomain),
  title: "A platform for rental products",
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
  alternates: {
    canonical: siteDomain + "/",
  },
  openGraph: {
    title: "e-Rentals: a platform for rental products",
    description:
      "e-Rentals.in offers comprehensive event and party rentals in Mumbai, with furniture, sound systems, lighting, appliances, tents, stages and decor on rent for hassle-free events at affordable rates.",
    url: siteDomain + "/",
    siteName: "e-Rentals",
    images: [
      {
        url: logoUrl,
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
    title: "e-Rentals: a platform for rental products",
    description:
      "Event and party rentals in Mumbai — furniture, sound, lighting, tents, decor and more at affordable rates.",
    images: [logoUrl],
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
          target: `${siteDomain}/?s={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
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
          <Toaster position="top-center" richColors />
          <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <Navbar />

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
