"use client";
import { useState } from "react";
import { sendContactMessage } from "@/services/publicService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow max-w-xl mx-auto mt-10">
      <h2 className="text-xl font-semibold">📞 Contact Us</h2>
      <Input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} />
      <Input name="email" placeholder="Your Email" type="email" value={formData.email} onChange={handleChange} />
      <Input name="mobile" placeholder="Mobile Number" type="tel" value={formData.mobile} onChange={handleChange} />
      <Textarea name="message" placeholder="Your Message..." rows={4} value={formData.message} onChange={handleChange} />
      <Button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
