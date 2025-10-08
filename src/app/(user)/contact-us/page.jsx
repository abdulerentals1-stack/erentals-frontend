import Script from "next/script";
import { Mail, Phone, MapPin } from "lucide-react";
import ContactUsForm from "@/components/user/ContactUsForm";

const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";
const logoUrl = "https://blr1.vultrobjects.com/erental-object/378f01fe-2344-4c35-90d2-07dcd2236dd8.png";

export const metadata = {
  metadataBase: new URL(siteDomain),
  title: "Contact Us – eRentals Mumbai | Event & Party Equipment Rental",
  description:
    "Get in touch with eRentals Mumbai for event rentals, party gear hire, furniture, lighting, sound, tent and decor on rent. Reach us via call, email or our contact form.",
  keywords: [
    "contact eRentals Mumbai",
    "event rental contact Mumbai",
    "party rentals contact",
    "furniture rental Mumbai contact",
    "lighting & sound rental contact",
    "tent decor rental Mumbai",
  ],
  alternates: {
    canonical: `${siteDomain}/contact`,
  },
  openGraph: {
    title: "Contact Us – eRentals Mumbai | Event & Party Equipment Rental",
    description:
      "Get in touch with eRentals Mumbai for event rentals, party gear hire, furniture, lighting, sound, tent and decor on rent. Reach us via call, email or our contact form.",
    url: `${siteDomain}/contact`,
    siteName: "e-Rentals",
    images: [
      {
        url: logoUrl,
        width: 1200,
        height: 630,
        alt: "e-Rentals Logo - Contact Us",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us – eRentals Mumbai | Event & Party Equipment Rental",
    description:
      "Get in touch with eRentals Mumbai for event rentals, party gear hire, furniture, lighting, sound, tent and decor on rent. Reach us via call, email or our contact form.",
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

export default function ContactPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Us – eRentals Mumbai",
    description:
      "Get in touch with eRentals Mumbai for event rentals, party gear hire, furniture, lighting, sound, tent and decor on rent. Reach us via call, email or our contact form.",
    url: `${siteDomain}/contact`,
    publisher: {
      "@type": "Organization",
      name: "e-Rentals",
      logo: { "@type": "ImageObject", url: logoUrl },
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9867348165", // replace with your contact number
      contactType: "customer service",
      email: "support@erentals.in",
    },
  };

  return (
    <section className="bg-gray-50 pt-8 pb-16">
      <Script
        id="contact-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <h1 className="text-3xl font-bold text-center mb-8 text-[#144169]">Contact Us</h1>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left - Contact Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#144169]">Get in Touch</h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Have questions about our services? Reach out via the form or use the details below—we’re happy to help.
          </p>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#144169]" />
              <a href="mailto:support@erentals.in" className="hover:underline">
                support@erentals.in
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#144169]" />
              <a href="tel:+919867348165" className="hover:underline">
                +91 9867348165
              </a>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#144169]" />
              <span>Mumbai, India</span>
            </div>
          </div>
        </div>

        {/* Right - Contact Form (Client Component) */}
        <ContactUsForm />
      </div>
    </section>
  );
}
