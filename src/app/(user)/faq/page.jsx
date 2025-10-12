import { Card, CardContent } from "@/components/ui/card";
import Script from "next/script";

const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";
const logoUrl = "https://blr1.vultrobjects.com/erental-object/378f01fe-2344-4c35-90d2-07dcd2236dd8.png";

export const metadata = {
  metadataBase: new URL(siteDomain),
  title: "Event Equipment & Furniture Rentals in Mumbai | eRentals India",
  description:
    "Rent a wide range of event equipment and party supplies from eRentals – including furniture, mandaps, lights, sound systems, electronics, crockery and more. Serving Mumbai and cities across India, we provide reliable delivery, setup and flexible rental packages for weddings, corporate events, exhibitions and private parties.",
  keywords: [
    "event rentals Mumbai",
    "event furniture rental",
    "party equipment hire",
    "stage lighting rental",
    "sound system rental",
    "LED screen rental",
    "wedding decor rental",
    "corporate event supplies",
    "mandap rental",
    "crockery rental",
    "camera rental",
    "special effects rental",
    "octonorm stall rental",
    "exhibition equipment hire",
    "home appliance rentals",
  ],
  alternates: { canonical: `${siteDomain}/faq` },
  openGraph: {
    title: "Event Equipment & Furniture Rentals in Mumbai | eRentals India",
    description:
      "Rent a wide range of event equipment and party supplies from eRentals – including furniture, mandaps, lights, sound systems, electronics, crockery and more. Serving Mumbai and cities across India, we provide reliable delivery, setup and flexible rental packages for weddings, corporate events, exhibitions and private parties.",
    url: `${siteDomain}/faq`,
    siteName: "e-Rentals",
    images: [{ url: logoUrl, width: 1200, height: 630, alt: "e-Rentals Logo" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Equipment & Furniture Rentals in Mumbai | eRentals India",
    description:
      "Rent a wide range of event equipment and party supplies from eRentals – including furniture, mandaps, lights, sound systems, electronics, crockery and more. Serving Mumbai and cities across India, we provide reliable delivery, setup and flexible rental packages for weddings, corporate events, exhibitions and private parties.",
    images: [logoUrl],
    creator: "@erentals",
  },
  icons: { icon: logoUrl, shortcut: logoUrl, apple: logoUrl },
  other: { "theme-color": "#ffffff" },
};

export default function FAQPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which documents do I need to place a rental order?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You must provide valid ID and address proof (e.g., office ID, Aadhaar card, PAN card, driving license, or passport). This KYC verification must be completed before an order can be confirmed.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to pay a security deposit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Security deposits are mandatory and vary depending on the item and quantity. Deposits are refundable when items are returned in good condition.",
        },
      },
      {
        "@type": "Question",
        name: "When is payment due?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "At least 50 % of the rental cost must be paid in advance (typically 72 hours before delivery). The remaining balance is due upon delivery.",
        },
      },
      {
        "@type": "Question",
        name: "Can I rerent the items to someone else?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. eRentals prohibits subleasing. You cannot rent the items to another person without notifying eRentals and receiving their approval.",
        },
      },
      // Add more FAQ entries similarly if needed
    ],
  };

  const faqs = [
    {
      category: "General Rental Process",
      items: [
        {
          question: "Which documents do I need to place a rental order?",
          answer:
            "You must provide valid ID and address proof (e.g., office ID, Aadhaar card, PAN card, driving license, or passport). This KYC verification must be completed before an order can be confirmed.",
        },
        {
          question: "Do I need to pay a security deposit?",
          answer:
            "Yes. Security deposits are mandatory and vary depending on the item and quantity. Deposits are refundable when items are returned in good condition.",
        },
        {
          question: "When is payment due?",
          answer:
            "At least 50 % of the rental cost must be paid in advance (typically 72 hours before delivery). The remaining balance is due upon delivery.",
        },
        {
          question: "Can I rerent the items to someone else?",
          answer:
            "No. eRentals prohibits subleasing. You cannot rent the items to another person without notifying eRentals and receiving their approval.",
        },
      ],
    },
    {
      category: "Delivery, Setup and Pickup",
      items: [
        {
          question: "Are there additional delivery or setup charges?",
          answer:
            "Yes. Delivery and setup fees depend on the type of item, quantity, rental duration and your location.",
        },
        {
          question: "Does the product come assembled?",
          answer:
            "Many items arrive readytouse, but some require onsite assembly. eRentals can assemble on request when you place your order.",
        },
        {
          question: "Can I pick up the item myself?",
          answer:
            "Yes. Customers may collect and return items themselves. Delivery and pickup services, with or without setup, are available at an additional cost.",
        },
        {
          question: "What happens if I exceed the rental duration?",
          answer:
            "Additional rental charges apply if you keep the items beyond the agreed rental period. Contact eRentals if you need to extend.",
        },
      ],
    },
    {
      category: "Placement and Event Planning",
      items: [
        {
          question: "Does eRentals handle placement of the materials at the venue?",
          answer:
            "Placement is decided by the customer. eRentals does not handle placement itself and requires someone on-site to determine the optimal location for each item. If you provide a clear layout beforehand, eRentals can set up according to that plan. If no layout is provided, you must handle the placement yourself.",
        },
        {
          question: "Will eRentals help plan my event or decide where to set up items?",
          answer:
            "No. eRentals does not offer event planning or determine the most suitable placement; customers are responsible for deciding where to use the rented items.",
        },
        {
          question: "Can eRentals assist with event planning or placement if needed?",
          answer:
            "Yes, but only if arranged before delivery. Planning or placement assistance is chargeable and must be requested in advance.",
        },
      ],
    },
    {
      category: "Product Use and Care",
      items: [
        {
          question: "Are there guidelines for using rental items?",
          answer:
            "Items must be used carefully and returned in good condition by the agreed time. Damage, misuse or late return may incur extra charges.",
        },
        {
          question: "Can I decorate or brand the rented items?",
          answer:
            "Yes. Decorations or branding (such as ribbons or banners) are allowed as long as they do not damage the product.",
        },
      ],
    },
    {
      category: "Product Specific Queries",
      items: [
        {
          question: "What area does the 200 W flood light cover?",
          answer: "The metal flood LED light covers about 30 square feet.",
        },
        {
          question: "What materials are used in the LED TV with stand?",
          answer:
            "The LED TV uses plastic, stainless steel and glass; it has an adjustable stand and supports HDMI and USB connectivity.",
        },
        {
          question: "What type of fabric is provided for chair covers?",
          answer:
            "The white cover with orange ribbon chair uses a crush-quality fabric. Covers and ribbons are supplied separately.",
        },
      ],
    },
    {
      category: "Contact & Support",
      items: [
        {
          question: "Support availability",
          answer:
            "eRentals provides customer support for scheduling, setup, and any questions about product usage or customization. Contact details are listed on the website.",
        },
        {
          question: "KYC verification",
          answer:
            "Provide the required ID and address proof to complete the verification process.",
        },
      ],
    },
    {
      category: "Damage and Liability",
      items: [
        {
          question: "What if I damage the rental materials?",
          answer:
            "Customers are liable for any damage or loss. The cost of repair or replacement must be paid before eRentals collects the materials.",
        },
      ],
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-5xl mx-auto px-4">
        <Card className="shadow-md border border-gray-200 rounded-2xl">
          <CardContent className="p-6 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-[#144169]">
                eRentals – Frequently Asked Questions
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                This FAQ covers common inquiries from eRentals customers (eRentals.in) regarding the rental process, payments, delivery, product care, placement responsibilities, and product details.
              </p>
            </div>

            {faqs.map((section, idx) => (
              <div key={idx} className="space-y-3 border-t pt-6">
                <h2 className="text-xl font-semibold text-[#144169]">{section.category}</h2>
                <div className="space-y-2">
                  {section.items.map((item, i) => (
                    <div key={i}>
                      <p className="font-semibold">{item.question}</p>
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
