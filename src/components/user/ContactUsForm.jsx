"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Mail, Phone, MessageSquare } from "lucide-react";
import { sendContactMessage } from "@/services/publicService";

export default function ContactUsForm() {
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", message: "" });
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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-5">
      <div className="relative">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="pl-10" />
      </div>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input name="email" placeholder="Your Email" type="email" value={formData.email} onChange={handleChange} className="pl-10" />
      </div>
      <div className="relative">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input name="mobile" placeholder="Mobile Number" type="tel" value={formData.mobile} onChange={handleChange} className="pl-10" />
      </div>
      <div className="relative">
        <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        <Textarea name="message" placeholder="Your Message..." rows={4} value={formData.message} onChange={handleChange} className="pl-10" />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-[#144169] hover:bg-[#0f3352] text-white font-medium">
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
