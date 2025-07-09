"use client";
import AddressList from "@/components/user/AddressList";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/utils/authUtils";
import { Skeleton } from "@/components/ui/skeleton";

const page = () => {
  const router = useRouter();
  const { isLoggedIn, isAdmin, ready } = useAuthStatus();
  useEffect(() => {
    if (!ready) return; // avoid flickering during hydration

    if (!isLoggedIn) {
      router.push("/login");
    } else if (isAdmin) {
      router.push("/admin/dashboard");
    }
  }, [isLoggedIn, isAdmin, ready]);

  if (!ready) return <Skeleton className="w-full h-80 rounded-xl" />;

  return (
    <div className="sm:px-12 md:px-16 lg:px-12 2xl:px-28 py-10">
      <AddressList />
    </div>
  );
};

export default page;
