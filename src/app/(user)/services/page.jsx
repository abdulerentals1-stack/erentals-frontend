import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Phone, ArrowUpRight, Calendar, User, Zap } from 'lucide-react';

const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";
const logoUrl = typeof process !== "undefined" && process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/e-rental-logo.png` : "https://e-rentals.in/e-rental-logo.png";

export const metadata = {
  metadataBase: new URL(siteDomain),
  title: "Premium Event & Corporate Production Services in Mumbai | e-Rentals",
  description: "Browse our premium event fabrication, custom main stages, background setups, ambient lighting, sound systems, and wedding decoration services in Mumbai.",
  keywords: [
    "event production Mumbai",
    "event fabrication services",
    "wedding stage decoration Mumbai",
    "sound & lighting setups",
    "corporate event setups",
  ],
  alternates: {
    canonical: `${siteDomain}/services`,
  },
  openGraph: {
    title: "Premium Event & Corporate Production Services in Mumbai | e-Rentals",
    description: "Browse our premium event fabrication, custom main stages, background setups, ambient lighting, sound systems, and wedding decoration services in Mumbai.",
    url: `${siteDomain}/services`,
    siteName: "e-Rentals",
    images: [
      {
        url: typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg` : 'https://e-rentals.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "e-Rentals Event Services Portfolio",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Event & Corporate Production Services in Mumbai | e-Rentals",
    description: "Browse our premium event fabrication, custom main stages, background setups, ambient lighting, sound systems, and wedding decoration services in Mumbai.",
    images: [typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg` : 'https://e-rentals.in/og-image.jpg'],
  },
};

export const dynamic = 'force-dynamic';

// Helper: strip HTML once at build/render time, not per-card
function stripHtml(html) {
  return html ? html.replace(/<[^>]*>/g, '') : '';
}

async function fetchServices() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/services?page=1&limit=100`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.services || [];
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await fetchServices();

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-zinc-900 min-h-screen pb-20">

      {/* 🚀 Hero Jumbotron Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#003459] to-[#001f35] text-white py-16 md:py-20 mb-12">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-blue-200 tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Event Showcases
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none text-white">
                Premium Event Services <br />
                <span className="text-[#00E8C6]">& Corporate Production</span>
              </h1>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl">
                Discover how we bring visions to life! Browse our stunning custom stages, professional ambient lighting, and elegant venue setup showcases crafted across top locations in Mumbai.
              </p>
            </div>

            {/* Quick Contact Widget */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:w-80 shrink-0 self-start md:self-center shadow-lg space-y-4">
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-[#00E8C6]" />
                <h3 className="font-bold text-sm tracking-wide uppercase text-[#00E8C6]">Plan Your Setup</h3>
              </div>
              <p className="text-xs text-gray-300 leading-normal">
                Looking to craft a majestic main stage, a premium welcome gate, or immersive audio-visual layout for your upcoming special occasion?
              </p>
              <a
                href="tel:+919867348165"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-[#00E8C6] text-[#003459] font-bold text-xs md:text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
              >
                <Phone className="w-4 h-4" /> Call Our Event Experts
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 📚 Grid Cards Listing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {services.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800 max-w-xl mx-auto px-4">
            <h3 className="font-extrabold text-lg text-gray-800 dark:text-white">No Setups Available</h3>
            <p className="text-gray-500 mt-2 text-sm max-w-sm mx-auto font-medium">
              We are currently compiling our premium layout setups. Check back in a few minutes!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              // Strip HTML once per card — not inside JSX render
              const snippet = service.metaDescription
                || (service.content ? `${stripHtml(service.content).substring(0, 150)}...` : 'Premium fabrication & custom structural installation configurations in Mumbai.');

              return (
                <Link
                  key={service._id}
                  href={`/services/${service.slug}`}
                  className="group bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800/80 shadow-sm hover:shadow-xl hover:border-blue-500/20 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
                >
                  <div>
                    {/* Image */}
                    <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
                      {service.coverImage?.url ? (
                        <Image
                          src={service.coverImage.url}
                          alt={service.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority={index < 2}
                        />
                      ) : (
                        <div className="w-full h-full bg-[#003459]/10 flex items-center justify-center text-[#003459] font-bold">
                          e-Rentals Showcase
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium border-b pb-3 border-gray-50 dark:border-zinc-800/50">
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span>{service.authorName ? service.authorName.split(',')[0] : 'Technical Team'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(service.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>

                      <h3 className="font-extrabold text-lg md:text-xl text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-3">
                        {service.title}
                      </h3>

                      <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm line-clamp-3 leading-relaxed mb-4">
                        {snippet}
                      </p>

                    </div>
                  </div>

                  {/* Card CTA Footer */}
                  <div className="px-6 pb-6 pt-3 border-t border-gray-50 dark:border-zinc-800/30 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 py-2 px-4 rounded-xl text-xs font-extrabold text-blue-600 group-hover:text-white group-hover:bg-blue-600 dark:text-blue-400 dark:group-hover:text-white dark:group-hover:bg-blue-600 transition-all duration-200">
                      View Details <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
