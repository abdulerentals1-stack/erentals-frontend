import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#003459] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
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
          <ul className="space-y-2 text-[15px] text-gray-300">
            <li>Email: admin@e-rentals.in</li>
            <li>Phone: +91 9867348165</li>
            <li>Location: Mumbai, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#1e4c75] mt-8">
        <Image 
          src="/Erental_Footer.png" 
          alt="Footer Stripe" 
          width={1920} 
          height={100} 
          className="w-full h-auto object-cover"
        />
        <div className="text-center py-4 text-sm text-gray-400">
          © {new Date().getFullYear()} Erentals. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

