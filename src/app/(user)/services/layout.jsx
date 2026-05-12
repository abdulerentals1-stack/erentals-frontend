const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";
const logoUrl = "https://blr1.vultrobjects.com/erental-object/378f01fe-2344-4c35-90d2-07dcd2236dd8.png";

export const metadata = {
  title: "Our Event Services & Custom Setups | e-Rentals",
  description: "Explore our premium event rental services and customized structural setups in Mumbai. From stage fabrication to complete event management.",
  alternates: {
    canonical: `${siteDomain}/services`,
  },
  openGraph: {
    title: "Premium Event Fabrication & Staging Services in Mumbai | e-Rentals",
    description: "Browse our stunning custom stages, welcome gates, sound, lighting, and venue setups crafted for weddings, corporate meets, and private parties in Mumbai.",
    url: `${siteDomain}/services`,
    siteName: "e-Rentals",
    images: [
      {
        url: logoUrl,
        width: 1200,
        height: 630,
        alt: "e-Rentals Premium Event Setup Services in Mumbai",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Event Fabrication & Staging Services in Mumbai | e-Rentals",
    description: "Browse our stunning custom stages, welcome gates, sound, lighting, and venue setups crafted for weddings, corporate meets, and private parties in Mumbai.",
    images: [logoUrl],
  },
};

export default function ServicesLayout({ children }) {
  return <>{children}</>;
}
