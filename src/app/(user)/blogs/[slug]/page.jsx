'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { getPublicBlogs, getPublicBlogBySlug } from '@/services/blogService';
import { Skeleton } from '@/components/ui/skeleton';
// import PaginationControls from '@/components/user/PaginationControls';
import Head from 'next/head';

export default function BlogDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params?.slug;

  const [blog, setBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const page = Number(searchParams?.get('page') || 1);
  const limit = 5; // blogs per page

  // Fetch single blog by slug
  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await getPublicBlogBySlug(slug);
        setBlog(res.data.blog);
      } catch (err) {
        console.error('Failed to fetch blog', err);
      }
    };

    fetchBlog();
  }, [slug]);

  // Fetch sidebar blog list with pagination
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await getPublicBlogs(1, 20);
        setBlogs(res.data.blogs || []);
        setPagination(res.data.pagination || { total: 0, page: 1, pages: 1 });
      } catch (err) {
        console.error('Failed to fetch blogs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page]);

  // Handle page change
  const handlePageChange = (newPage) => {
    const query = new URLSearchParams(searchParams || {});
    query.set('page', newPage);
    router.replace(`/blogs/${slug}?${query.toString()}`);
  };

  if (!blog) return <Skeleton className="w-full h-64 rounded-xl" />;

  return (
    <>
      {/* SEO */}
      <Head>
        <title>{blog.metaTitle || blog.title}</title>
        {blog.metaDescription && (
          <meta name="description" content={blog.metaDescription} />
        )}
        {blog.metaKeywords && blog.metaKeywords.length > 0 && (
          <meta name="keywords" content={blog.metaKeywords.join(', ')} />
        )}
      </Head>

      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto mt-8 px-4">

        {/* Main Blog Content */}
        <div className="md:w-3/4 p-4 bg-white dark:bg-zinc-900 rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-2">{blog.title}</h1>
          <p className="text-sm text-gray-500 mb-4">{blog.authorName}</p>

          {blog.coverImage && (
            <div className="relative w-full h-64 mb-4 rounded overflow-hidden">
              <Image
                src={blog.coverImage.url}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {/* Left Sidebar */}
        <div className="md:w-1/4 border-r p-4">
          <h2 className="font-semibold mb-4">All Blogs</h2>
          {loading
            ? Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton key={idx} className="h-6 mb-2 rounded" />
              ))
            : blogs.map((b) => (
                <Link
                  key={b._id}
                  href={`/blogs/${b.slug}`}
                  className={`block p-2 mb-1 rounded hover:bg-gray-100 ${
                    b.slug === slug ? 'bg-gray-200 font-semibold' : ''
                  }`}
                >
                  {b.title}
                </Link>
              ))}

          {/* Pagination */}
          {/* <PaginationControls
            page={pagination.page}
            totalPagesFromApi={pagination.pages}
            path={`/blogs/${slug}`}
            searchParams={{}}
            onPageChange={handlePageChange} // optional callback if needed
          /> */}
        </div>
      </div>
    </>
  );
}
