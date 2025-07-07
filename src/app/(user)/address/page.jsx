"use client";
import AddressList from "@/components/user/AddressList";
import { useAuth } from "@/context/AuthContext";
import React from "react";

const page = () => {
  const { user } = useAuth();

  if (!user) {
    toast.error("Please login to add items to cart.");
    return router.push("/login");
  }

  if (user?.role === "admin") {
    toast.error("Admin not able to Checkout cart.");
    return router.push("/admin/dashboard");
  }
  return (
    <div className="sm:px-12 md:px-16 lg:px-12 2xl:px-28 py-10">
      <AddressList />
    </div>
  );
};

export default page;
