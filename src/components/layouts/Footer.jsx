"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import api from "@/lib/axios";
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  const [settings, setSettings] = useState({
    FOOTER_EMAIL: "sales@e-rentals.in",
    FOOTER_PHONE: "+91 9867348165",
    FOOTER_LOCATION: "Vikhroli, Mumbai, India",
    SOCIAL_FACEBOOK: "",
    SOCIAL_INSTAGRAM: "",
    SOCIAL_TWITTER: "",
    SOCIAL_YOUTUBE: "",
    SOCIAL_LINKEDIN: ""
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/system-config/public");
        if (data && data.success && data.data) {
          setSettings(prev => ({
            ...prev,
            FOOTER_EMAIL: data.data.FOOTER_EMAIL || prev.FOOTER_EMAIL,
            FOOTER_PHONE: data.data.FOOTER_PHONE || prev.FOOTER_PHONE,
            FOOTER_LOCATION: data.data.FOOTER_LOCATION || prev.FOOTER_LOCATION,
            SOCIAL_FACEBOOK: data.data.SOCIAL_FACEBOOK || "",
            SOCIAL_INSTAGRAM: data.data.SOCIAL_INSTAGRAM || "",
            SOCIAL_TWITTER: data.data.SOCIAL_TWITTER || "",
            SOCIAL_YOUTUBE: data.data.SOCIAL_YOUTUBE || "",
            SOCIAL_LINKEDIN: data.data.SOCIAL_LINKEDIN || ""
          }));
        }
      } catch (err) {
        console.error("Error fetching system configs in footer:", err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-[#003459] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        {/* Brand */}
        <div className="text-center md:text-left">
          <Image
            src="/e-rental-logo.png"
            alt="Erentals Logo"
            width={200}
            height={200}
            className="w-32 md:w-40 h-auto object-contain mx-auto md:mx-0 mb-6 bg-white p-3 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          />
          <p className="text-base text-gray-300 leading-relaxed">
            Erentals is your trusted marketplace for renting products for weddings, exhibitions, and corporate events.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold mb-4">Rental Categories</h4>
          <ul className="space-y-2 text-[15px] text-gray-300">
            <li><Link href="/products" className="hover:underline">All Products Catalog</Link></li>
            <li><Link href="/services" className="hover:underline">Services & Events Portfolio</Link></li>
            <li><Link href="/categories/furniture" className="hover:underline">Furniture Rentals</Link></li>
            <li><Link href="/categories/lights-sound" className="hover:underline">Sound & Lighting Hire</Link></li>
            <li><Link href="/categories/exhibition-fabrication" className="hover:underline">Staging & AC Tents</Link></li>
            <li><Link href="/faq" className="hover:underline">Frequently Asked Questions</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-[15px] text-gray-300">
            <li><Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="/shipping-and-delivery" className="hover:underline">Shipping & Delivery</Link></li>
            <li><Link href="/payment-policy" className="hover:underline">Payment Policy</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:underline">Term & Conditions</Link></li>
            <li><Link href="/about-us" className="hover:underline">About Us</Link></li>
            <li><Link href="/contact-us" className="hover:underline">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-2 text-[15px] text-gray-300 mb-4">
            <li>Email: {settings.FOOTER_EMAIL}</li>
            <li>Phone: {settings.FOOTER_PHONE}</li>
            <li>Location: {settings.FOOTER_LOCATION}</li>
          </ul>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-start gap-3 mt-4">
            {settings.SOCIAL_FACEBOOK && (
              <a href={settings.SOCIAL_FACEBOOK} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1e4c75] rounded-full hover:bg-amber-600 transition-colors text-white" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {settings.SOCIAL_INSTAGRAM && (
              <a href={settings.SOCIAL_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1e4c75] rounded-full hover:bg-amber-600 transition-colors text-white" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {settings.SOCIAL_TWITTER && (
              <a href={settings.SOCIAL_TWITTER} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1e4c75] rounded-full hover:bg-amber-600 transition-colors text-white" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {settings.SOCIAL_YOUTUBE && (
              <a href={settings.SOCIAL_YOUTUBE} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1e4c75] rounded-full hover:bg-amber-600 transition-colors text-white" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {settings.SOCIAL_LINKEDIN && (
              <a href={settings.SOCIAL_LINKEDIN} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1e4c75] rounded-full hover:bg-amber-600 transition-colors text-white" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[#1e4c75] mt-8">
        <div className="text-center py-4 text-sm text-gray-400">
          © {new Date().getFullYear()} Erentals. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

