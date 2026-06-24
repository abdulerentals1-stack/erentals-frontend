import { getPublicServiceBySlug, fetchPublicServicesISR } from '@/services/serviceService';
import ServiceDetailClient from './ServiceDetailClient';

export const revalidate = 3600; // Revalidate every hour (ISR)

const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";
const logoUrl = typeof process !== "undefined" && process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/e-rental-logo.png` : "https://e-rentals.in/e-rental-logo.png";
const ogImageUrl = typeof process !== "undefined" && process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg` : "https://e-rentals.in/og-image.jpg";

export async function generateStaticParams() {
  try {
    const { fetchPublicServicesISR } = await import('@/services/serviceService');
    const res = await fetchPublicServicesISR(1, 100);
    const services = res.data?.services || [];
    return services.map((service) => ({
      slug: service.slug,
    }));
  } catch (err) {
    console.error("Failed to generate static params for services:", err);
    return [];
  }
}

// 🚀 Dynamic Meta Generation for Search Ranking
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    return {
      title: "Event Service Setup - e-Rentals",
      description: "Premium event rental structures and customized setups in Mumbai.",
      alternates: {
        canonical: `${siteDomain}/services`,
      },
    };
  }

  try {
    const res = await getPublicServiceBySlug(slug);
    const service = res.data?.service;

    if (!service) {
      return {
        title: "Service Not Found – e-Rentals",
        description: "The requested event setup service could not be found.",
        alternates: {
          canonical: `${siteDomain}/services/${slug}`,
        },
        openGraph: {
          url: `${siteDomain}/services/${slug}`,
        },
      };
    }

    const title = `${service.title} | Premium Event Rental Services in Mumbai`;
    const fallbackDesc = service.metaDescription || service.summary || (service.content ? `${service.content.replace(/<[^>]*>/g, '').slice(0, 150)}...` : "Premium structural event fabrication and setup solutions in Mumbai by e-Rentals.");

    return {
      title,
      description: fallbackDesc,
      alternates: {
        canonical: `${siteDomain}/services/${slug}`,
      },
      openGraph: {
        title,
        description: fallbackDesc,
        url: `${siteDomain}/services/${slug}`,
        type: "article",
        images: [
          {
            url: service.coverImage?.url || service.images?.[0]?.url || ogImageUrl,
            width: 1200,
            height: 630,
            alt: service.title,
          },
        ],
        siteName: "e-Rentals",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: fallbackDesc,
        images: [service.coverImage?.url || service.images?.[0]?.url || ogImageUrl],
      },
    };
  } catch (err) {
    console.error("Error generating metadata for service slug:", slug, err);
    return {
      title: "Event Rental Services - e-Rentals",
      description: "Professional customized rental staging, sound, and lighting solutions in Mumbai.",
      alternates: {
        canonical: `${siteDomain}/services/${slug}`,
      },
      openGraph: {
        url: `${siteDomain}/services/${slug}`,
      },
    };
  }
}

export default async function ServiceSlugPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  // Fetch service detail AND sidebar list in parallel on the server
  const [serviceResult, sidebarResult] = await Promise.allSettled([
    slug ? getPublicServiceBySlug(slug) : Promise.resolve(null),
    fetchPublicServicesISR(1, 20),
  ]);

  const service = serviceResult.status === 'fulfilled' ? serviceResult.value?.data?.service ?? null : null;
  const sidebarServices = sidebarResult.status === 'fulfilled' ? sidebarResult.value?.data?.services ?? [] : [];

  return <ServiceDetailClient initialService={service} initialServices={sidebarServices} slug={slug} />;
}
