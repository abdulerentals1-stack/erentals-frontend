"use client";

import { useState } from "react";
import Link from "next/link";
import { sendContactMessage } from "@/services/publicService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Phone, Mail, User, MessageSquare, MapPin } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, mobile, message } = formData;

    if (!name || !email || !mobile || !message) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await sendContactMessage({ ...formData, type: "contact" });
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", mobile: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 pt-8 pb-16">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#144169]">Contact Us</h1>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left - Contact Info */}
        <div className="space-y-6">
          <h2
            className="text-xl font-bold"
            style={{ color: "#144169" }}
          >
            Get in Touch
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Have questions about our services? Reach out via the form or use the
            details below—we’re happy to help.
          </p>

          <div className="space-y-4 text-gray-700">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#144169]" />
              <Link
                href="mailto:support@erentals.in"
                className="hover:underline"
              >
                support@erentals.in
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#144169]" />
              <Link href="tel:+919876543210" className="hover:underline">
                +91 9876543210
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#144169]" />
              <span>Mumbai, India</span>
            </div>
          </div>
        </div>

        {/* Right - Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-5"
        >
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="pl-10"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              name="email"
              placeholder="Your Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="pl-10"
            />
          </div>

          {/* Mobile */}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              name="mobile"
              placeholder="Mobile Number"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              className="pl-10"
            />
          </div>

          {/* Message */}
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <Textarea
              name="message"
              placeholder="Your Message..."
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="pl-10"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#144169] cursor-pointer hover:bg-[#0f3352] text-white font-medium"
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
