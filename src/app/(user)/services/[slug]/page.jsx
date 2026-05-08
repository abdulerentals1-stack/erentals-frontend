import { getPublicBlogBySlug } from '@/services/blogService';
import ServiceDetailClient from './ServiceDetailClient';

const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";

// 🚀 Dynamic Meta Generation for Search Ranking
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    return {
      title: "Event Service Setup - e-Rentals",
      description: "Premium event rental structures and customized setups in Mumbai.",
    };
  }

  try {
    const res = await getPublicBlogBySlug(slug);
    const blog = res.data?.blog;

    if (!blog) {
      return {
        title: "Service Not Found – e-Rentals",
        description: "The requested event setup service could not be found.",
      };
    }

    const title = `${blog.title} | Premium Event Rental Services in Mumbai`;
    const fallbackDesc = blog.metaDescription || blog.summary || (blog.content ? `${blog.content.replace(/<[^>]*>/g, '').slice(0, 150)}...` : "Premium structural event fabrication and setup solutions in Mumbai by e-Rentals.");

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
            url: blog.coverImage?.url || blog.images?.[0]?.url || "/logo.png",
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        siteName: "e-Rentals",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: fallbackDesc,
        images: [blog.coverImage?.url || blog.images?.[0]?.url || "/logo.png"],
      },
    };
  } catch (err) {
    console.error("Error generating metadata for blog slug:", slug, err);
    return {
      title: "Event Rental Services - e-Rentals",
      description: "Professional customized rental staging, sound, and lighting solutions in Mumbai.",
    };
  }
}

export default async function ServiceSlugPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  let blog = null;

  try {
    if (slug) {
      const res = await getPublicBlogBySlug(slug);
      blog = res.data?.blog;
    }
  } catch (err) {
    console.error("Failed to load blog on server render:", err);
  }

  return <ServiceDetailClient initialBlog={blog} slug={slug} />;
}
