import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#003459] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="text-center md:text-left">
          <Image
            src="https://blr1.vultrobjects.com/erental-object/11b39b1a-3c1e-41d8-933a-6486505ff395.png"
            alt="Erentals Logo"
            width={160}
            height={45}
            className="mx-auto md:mx-0 mb-4"
          />
          <p className="text-base text-gray-300 leading-relaxed">
            Erentals is your trusted marketplace for renting products for weddings, exhibitions, and corporate events.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-[15px] text-gray-300">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/checkout" className="hover:underline">Checkout</Link></li>
            <li><Link href="/products" className="hover:underline">All Products</Link></li>
            <li><Link href="/quotation-checkout" className="hover:underline">Quotation</Link></li>
            {/* <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:underline">Terms & Conditions</Link></li> */}
            <li><Link href="/faq" className="hover:underline">FAQs</Link></li>
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
            <li>Email: support@erentals.in</li>
            <li>Phone: +91 9876543210</li>
            <li>Location: Mumbai, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#1e4c75] mt-8 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} Erentals. All rights reserved.
      </div>
    </footer>
  );
}
