"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendProductEnquiry } from "@/services/publicService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ✅ Zod schema
const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  mobile: z
    .string()
    .regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

export default function ProductEnquiryForm({ product }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(enquirySchema),
  });

  const onSubmit = async (data) => {
    try {
      await sendProductEnquiry({
        ...data,
        type: "product",
        productId: product._id,
      });
      toast.success("Enquiry sent successfully!");
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send enquiry");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 bg-white rounded shadow max-w-xl mx-auto"
    >
      <h2 className="text-xl font-semibold">Product Enquiry</h2>

      <div>
        <Input placeholder="Your Name" {...register("name")} />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Input type="email" placeholder="Your Email" {...register("email")} />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input type="tel" placeholder="Mobile Number" {...register("mobile")} />
        {errors.mobile && (
          <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
        )}
      </div>

      <div>
        <Textarea
          placeholder="Your Enquiry..."
          rows={4}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Enquiry"}
      </Button>
    </form>
  );
}
