'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getPublicServiceBySlug } from '@/services/serviceService';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Send, Phone, Mail, ShieldCheck, HeartHandshake, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Script from 'next/script';

import api from '@/lib/axios';

export default function ServiceDetailClient({ initialService, initialServices = [], slug }) {
  const router = useRouter();

  const [services, setServices] = useState(initialServices);
  const [service, setService] = useState(initialService);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [loading, setLoading] = useState(!initialService);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    requirements: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch active service details
  useEffect(() => {
    if (service) {
      setLoading(false);
      return;
    }
    if (!slug) return;

    const fetchServiceDetail = async () => {
      try {
        setLoading(true);
        const res = await getPublicServiceBySlug(slug);
        setService(res.data.service);
      } catch (err) {
        console.error('Failed to fetch service detail by slug', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [slug, service]);

  // Sidebar list is pre-fetched server-side and seeded via initialServices prop

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error('Please fill in your Name, Phone Number, and Email!');
      return;
    }

    // Clean phone number (strip spaces/symbols) to get 10-digit number for backend validation
    const cleanedPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanedPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number!');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/enquiry', {
        name: formData.name,
        email: formData.email,
        mobile: cleanedPhone,
        message: formData.requirements || `Custom Event setup inquiry for: "${service.title}"`
      });

      toast.success('🎉 Custom quote request submitted! Our event manager will call you within 2 hours.');
      setFormData({ name: '', phone: '', email: '', requirements: '' });
    } catch (err) {
      console.error('Enquiry submission failed:', err);
      toast.error(err.response?.data?.message || 'Failed to submit enquiry. Please try again!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !service) {
    return (
      <div className="max-w-7xl mx-auto mt-8 px-4 flex flex-col md:flex-row gap-6">
        <div className="md:w-3/4 p-6 bg-white rounded-xl shadow-sm space-y-4">
          <Skeleton className="h-8 w-3/4 rounded" />
          <Skeleton className="h-4 w-1/4 rounded" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <div className="md:w-1/4 p-4 bg-white rounded-xl shadow-sm space-y-3">
          <Skeleton className="h-6 w-1/2 rounded" />
          <Skeleton className="h-10 w-full rounded" />
        </div>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: service?.title,
    image: [
      service?.images?.[0]?.url || service?.coverImage?.url || "https://blr1.vultrobjects.com/erental-object/378f01fe-2344-4c35-90d2-07dcd2236dd8.png"
    ],
    datePublished: service?.createdAt || new Date().toISOString(),
    dateModified: service?.updatedAt || new Date().toISOString(),
    author: [{
      "@type": "Person",
      name: service?.authorName || "e-Rentals Team",
      url: "https://e-rentals.in/about-us"
    }],
    publisher: {
      "@type": "Organization",
      name: "e-Rentals",
      logo: {
        "@type": "ImageObject",
        url: "https://blr1.vultrobjects.com/erental-object/378f01fe-2344-4c35-90d2-07dcd2236dd8.png"
      }
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen py-8">
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[
          { label: "Services", href: "/services" },
          { label: service.title }
        ]} />

        {/* Main Columns Container */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: Main Active Service Content */}
          <div className="lg:w-3/4 flex flex-col gap-6">
            
            {/* The Main Content Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-zinc-800">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#003459] dark:text-white leading-tight mb-2">
                {service.title}
              </h1>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
                Supervisor - {service.authorName || 'E-Rentals Technical Team'}
              </p>

              {/* Dynamic Slideshow or Cover Image Fallback */}
              {service.images && service.images.length > 0 ? (
                <div className="relative w-full h-[250px] md:h-[450px] mb-8 rounded-xl overflow-hidden shadow-sm group/slider">
                  <Image
                    src={service.images[activeImgIndex]?.url || service.coverImage?.url}
                    alt={service.images[activeImgIndex]?.alt || service.coverImage?.alt || service.title || "Event Service"}
                    fill
                    className="object-cover transition-all duration-500"
                    sizes="(max-w-1024px) 100vw, 80vw"
                    priority
                  />
                  
                  {/* Left Navigation Arrow */}
                  {service.images.length > 1 && (
                    <button
                      onClick={() => setActiveImgIndex((prev) => (prev === 0 ? service.images.length - 1 : prev - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 p-2.5 rounded-full shadow-md transition-all duration-200 hover:scale-105 z-10"
                      title="Previous Image"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#003459] dark:text-white" />
                    </button>
                  )}

                  {/* Right Navigation Arrow */}
                  {service.images.length > 1 && (
                    <button
                      onClick={() => setActiveImgIndex((prev) => (prev === service.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 p-2.5 rounded-full shadow-md transition-all duration-200 hover:scale-105 z-10"
                      title="Next Image"
                    >
                      <ChevronRight className="w-5 h-5 text-[#003459] dark:text-white" />
                    </button>
                  )}

                  {/* Slider Progress Indicator Dots */}
                  {service.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/35 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      {service.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImgIndex(idx)}
                          className={`h-2 transition-all rounded-full ${
                            activeImgIndex === idx ? 'w-5 bg-white' : 'w-2 bg-white/50 hover:bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : service.coverImage?.url ? (
                <div className="relative w-full h-[250px] md:h-[450px] mb-8 rounded-xl overflow-hidden shadow-sm">
                  <Image
                    src={service.coverImage.url}
                    alt={service.coverImage?.alt || service.title || "Event Service"}
                    fill
                    className="object-cover"
                    sizes="(max-w-1024px) 100vw, 80vw"
                    priority
                  />
                </div>
              ) : null}

              {/* Dynamic HTML Content */}
              <div 
                className="prose prose-blue max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: service.content }}
              />
            </div>

            {/* Custom Quote Request Form Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-bold text-[#003459] dark:text-white">
                  Get a Custom Setup Quote for Your Event
                </h2>
              </div>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-2xl">
                Wowed by this setup? Let our specialized engineers design and deliver the perfect customized layout for your upcoming corporate meet, wedding, or private party.
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Vikas Sharma"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-transparent text-sm outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 98673 48165"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-transparent text-sm outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. vikas@gmail.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-transparent text-sm outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Your Specific Event Setup Requirements
                  </label>
                  <textarea 
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder={`Describe what you need (e.g. setup similar to "${service.title}", approximate budget, size of the venue...)`}
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-transparent text-sm outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Free on-site layout design mapping in Mumbai</span>
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs md:text-sm font-bold bg-[#003459] hover:bg-[#00243d] text-white transition duration-200 disabled:opacity-60"
                  >
                    {isSubmitting ? 'Submitting Quote...' : (
                      <>
                        <Send className="w-4 h-4" />
                        Request Setup Pricing Proposal
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* RIGHT: Sidebar Listing of All Other Services */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800 sticky top-6">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#003459] dark:text-blue-400 mb-4 border-b pb-2">
                Related Services
              </h2>
              
              <div className="flex flex-col gap-4">
                {services.map((b) => (
                  <Link
                    key={b._id}
                    href={`/services/${b.slug}`}
                    className={`block relative w-full h-36 md:h-40 rounded-xl overflow-hidden transition-all duration-300 group/card border-2 ${
                      b._id === service._id 
                        ? 'border-blue-500 scale-[1.02] shadow-md ring-2 ring-blue-500/20' 
                        : 'border-transparent hover:scale-[1.01] hover:shadow-sm'
                    }`}
                  >
                    {/* Background Full Image */}
                    {b.coverImage?.url ? (
                      <Image
                        src={b.coverImage.url}
                        alt={b.coverImage?.alt || b.title || "Event Service"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                        sizes="(max-w-768px) 100vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#003459] dark:bg-zinc-850" />
                    )}

                    {/* Dark Overlap Gradient Behind Title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Text Overlay at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                      <p className="text-white text-xs font-bold leading-snug line-clamp-2 drop-shadow-md">
                        {b.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Sidebar Quick Connect Details */}
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Immediate Booking</span>
                </div>
                
                <a 
                  href="tel:+919867348165"
                  className="flex items-center gap-3 text-xs md:text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>+91 98673 48165</span>
                </a>
                
                <a 
                  href="mailto:support@e-rentals.in"
                  className="flex items-center gap-3 text-xs md:text-sm text-gray-500 hover:text-blue-600"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>support@e-rentals.in</span>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
