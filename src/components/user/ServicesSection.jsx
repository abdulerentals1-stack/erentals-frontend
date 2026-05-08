'use client';

import Link from 'next/link';
import { Sparkles, Calendar, Laptop, Building2, Mic2, Sofa, Wind, ArrowRight } from 'lucide-react';

export default function ServicesSection() {
  const premiumServices = [
    {
      slug: 'wedding-mandaps-and-decor',
      title: 'Wedding Mandaps & Decor',
      description: 'Stunning premium wooden and cloth-draped mandaps, flower-decked stages, royal bride/groom seating, and grand entrance walkways.',
      icon: <Calendar className="w-8 h-8 text-pink-600" />,
      color: 'hover:border-pink-500/50 hover:shadow-pink-500/5',
      tag: 'Festive & Royal'
    },
    {
      slug: 'corporate-av-and-conference',
      title: 'Corporate AV & Conferences',
      description: 'Professional-grade presentation equipment, pristine audio setups with cordless mics, HD projection systems, high-quality podiums, and executive chair options.',
      icon: <Laptop className="w-8 h-8 text-blue-600" />,
      color: 'hover:border-blue-500/50 hover:shadow-blue-500/5',
      tag: 'Executive & Sleek'
    },
    {
      slug: 'exhibition-stall-fabrication',
      title: 'Exhibition Stall Fabrication',
      description: 'Sturdy Octonorm modular shell-scheme stalls, customized lockable presentation counters, brochure showcases, and bright spot-lighting fixtures.',
      icon: <Building2 className="w-8 h-8 text-emerald-600" />,
      color: 'hover:border-emerald-500/50 hover:shadow-emerald-500/5',
      tag: 'Trade Shows & Expos'
    },
    {
      slug: 'concerts-stage-and-sound',
      title: 'Concerts & Mega Stage Hire',
      description: 'Extreme heavy-duty stages (up to 6ft), premium line-array sound speaker walls, professional mojo barricading, and intelligent LED lighting systems.',
      icon: <Mic2 className="w-8 h-8 text-amber-600" />,
      color: 'hover:border-amber-500/50 hover:shadow-amber-500/5',
      tag: 'High Energy & Epic'
    },
    {
      slug: 'lounge-and-party-furnishing',
      title: 'Lounge & Party Furnishing',
      description: 'Ultra-modern Katrina & Box sofas, elegant cocktail high-tables, premium bar stools in multiple configurations, and ambient LED color mood lights.',
      icon: <Sofa className="w-8 h-8 text-purple-600" />,
      color: 'hover:border-purple-500/50 hover:shadow-purple-500/5',
      tag: 'Chic & Comfortable'
    },
    {
      slug: 'climate-control-and-appliances',
      title: 'Climate & Large Appliances',
      description: 'High-tonnage portable tower air-conditioners, heavy-duty outdoor mist fans, large pedestal cooling units, and catering-grade deep freezers.',
      icon: <Wind className="w-8 h-8 text-cyan-600" />,
      color: 'hover:border-cyan-500/50 hover:shadow-cyan-500/5',
      tag: 'Summer & Comfort'
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-[#F3F9FB] dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-[#003459] dark:bg-blue-900/40 dark:text-blue-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Event Solutions
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#003459] dark:text-white tracking-tight">
              Our Professional Event Services
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl text-sm md:text-base">
              Beyond just renting items, we design complete end-to-end setups for weddings, trade shows, corporate meets, and live gatherings in Mumbai.
            </p>
          </div>
          
          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#003459] hover:text-blue-700 transition duration-300 group"
          >
            Explore All Services 
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumServices.map((service) => (
            <div 
              key={service.slug}
              className={`bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${service.color} flex flex-col justify-between h-full`}
            >
              <div>
                {/* Icon & Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                    {service.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-zinc-800 dark:text-gray-400 px-2.5 py-1 rounded-full">
                    {service.tag}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-[#003459] dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              {/* Action Link */}
              <Link 
                href={`/services/${service.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-auto group/btn"
              >
                Inquire & View Setup
                <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
