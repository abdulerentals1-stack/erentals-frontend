import { Card, CardContent } from "@/components/ui/card";
import Script from "next/script";

const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";
const logoUrl = "https://blr1.vultrobjects.com/erental-object/378f01fe-2344-4c35-90d2-07dcd2236dd8.png";

export const metadata = {
  metadataBase: new URL(siteDomain),
  title: "Terms & Conditions – eRentals Mumbai | Event Rental Services",
  description:
    "Read eRentals Mumbai’s Terms & Conditions — rules, booking & cancellation policy for event rentals: furniture, lighting, sound, tents, stage & decor hire in Mumbai.",
  keywords: [
    "terms and conditions",
    "event rentals Mumbai terms",
    "party rentals Mumbai policy",
    "furniture rental terms Mumbai",
    "lighting rental policy Mumbai",
    "sound system rental terms",
    "tent rental terms Mumbai",
    "stage rental policy Mumbai",
    "decor rental terms",
    "appliance rental terms",
    "rental services Mumbai policies",
    "booking and cancellation policy",
    "delivery and pickup policy",
    "damage and deposit policy",
    "refund policy Mumbai rentals",
    "eRentals terms",
    "e-rentals terms",
  ],
  alternates: {
    canonical: `${siteDomain}/terms`,
  },
  openGraph: {
    title: "Terms & Conditions – eRentals Mumbai | Event Rental Services",
    description:
      "Read eRentals Mumbai’s Terms & Conditions — rules, booking & cancellation policy for event rentals: furniture, lighting, sound, tents, stage & decor hire in Mumbai.",
    url: `${siteDomain}/terms`,
    siteName: "e-Rentals",
    images: [
      {
        url: logoUrl,
        width: 1200,
        height: 630,
        alt: "e-Rentals Logo - Terms & Conditions",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions – eRentals Mumbai | Event Rental Services",
    description:
      "Read eRentals Mumbai’s Terms & Conditions — rules, booking & cancellation policy for event rentals: furniture, lighting, sound, tents, stage & decor hire in Mumbai.",
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


export default function TermsAndConditions() {

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms & Conditions – eRentals Mumbai",
    description:
      "Read eRentals Mumbai’s Terms & Conditions — rules, booking & cancellation policy for event rentals: furniture, lighting, sound, tents, stage & decor hire in Mumbai.",
    url: `${siteDomain}/terms`,
    publisher: {
      "@type": "Organization",
      name: "e-Rentals",
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
      },
    },
  };


  return (
    <section className="py-12 bg-gray-50">
      <Script
        id="terms-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-5xl mx-auto px-4">
        <Card className="shadow-md border border-gray-200 rounded-2xl">
          <CardContent className="p-6 space-y-8">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-[#144169]">
                Terms and Conditions
              </h1>
              <p className="text-gray-600">
                Please read the following terms carefully before renting any
                products or services from eRentals. By proceeding, you agree to
                abide by these conditions.
              </p>
            </div>

            {/* Product Quality & Quantity */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-[#144169]">
                Product Quality & Quantity
              </h2>
              <p>
                Customers are responsible for inspecting the quality and
                quantity of products upon delivery. Any discrepancies or issues
                must be reported immediately. Failure to do so within 24 hours
                will assume the product has been accepted as delivered.
              </p>
            </div>

            {/* Product Safety & Security Deposit */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Product Safety & Security Deposit
              </h2>
              <p>
                A refundable security deposit is required prior to the release
                of rented items. The deposit ensures protection against loss or
                damage. It will be returned to the customer within 24 hours of
                the product being returned in acceptable condition. In the event
                of damage, the cost of repairs will be deducted from the
                deposit.
              </p>
            </div>

            {/* Refund Policy */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Refund Policy
              </h2>
              <p>
                Refunds for the security deposit will be processed within 24
                hours of returning the products in satisfactory condition. Any
                deductions due to damage or loss will be clearly communicated.
              </p>
            </div>

            {/* Damage & Loss Policy */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Damage & Loss Policy
              </h2>
              <p>
                In case of damage or loss, a proportionate amount based on
                repair or replacement costs will be charged to the customer. The
                determination of costs will be based on industry standards for
                similar products and repairs.
              </p>
            </div>

            {/* KYC Policy */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Know Your Customer (KYC) Policy
              </h2>
              <p>
                Customers must complete the KYC process before any rentals can
                proceed. This includes providing a government-issued ID and
                proof of local address. In cases where the customer cannot
                provide such documentation, a reference person with valid local
                proof of address may complete the KYC process on their behalf.
              </p>
            </div>

            {/* Delivery & Pickup Responsibilities */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Delivery & Pickup Responsibilities
              </h2>
              <p>
                Customers are expected to inspect the product at the time of
                delivery and pickup. Any damages identified at this stage must
                be recorded and reported immediately. Customers are responsible
                for ensuring safe handling during delivery and pickup.
              </p>
            </div>

            {/* Legal Compliance */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Legal Compliance
              </h2>
              <p>
                This agreement adheres to applicable local and national laws,
                including regulations governing rental services, consumer
                rights, and data privacy. Any disputes arising will be subject
                to the jurisdiction of the courts where the company is
                registered.
              </p>
            </div>

            {/* Payment Terms */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Payment Terms
              </h2>
              <p>
                Payment is required in full before delivery. Payment gateways
                used by the company comply with security and encryption
                standards to ensure the safety of customer data during
                transactions.
              </p>
            </div>

            {/* Liability Disclaimer */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Liability Disclaimer
              </h2>
              <p>
                The company is not liable for any indirect, incidental, or
                consequential damages related to the use of rented products.
                Customers assume full responsibility for the use of rented items
                and any risks associated with them.
              </p>
            </div>

            {/* Amendments */}
            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl font-semibold text-[#144169]">
                Amendments
              </h2>
              <p>
                These terms and conditions may be updated periodically to
                reflect changes in business practices or legal requirements.
                Customers will be notified of any substantial changes prior to
                the new terms taking effect.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
