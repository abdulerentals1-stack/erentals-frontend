"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PaginationControls({ page, limit, total, path, searchParams }) {
  const router = useRouter();
  const totalPages = Math.ceil(total / limit);
  const query = new URLSearchParams(searchParams);

  const handlePageChange = (newPage) => {
    query.set("page", newPage);
    router.replace(`${path}?${query.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
      <Button
        size="sm"
        variant="outline"
        disabled={page <= 1}
        onClick={() => handlePageChange(Number(page) - 1)}
      >
        Previous
      </Button>

      {[...Array(totalPages)].map((_, index) => {
        const pageNum = index + 1;
        return (
          <Button
            key={pageNum}
            size="sm"
            variant={Number(page) === pageNum ? "default" : "outline"}
            onClick={() => handlePageChange(pageNum)}
            className='cursor-pointer'
          >
            {pageNum}
          </Button>
        );
      })}

      <Button
        size="sm"
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => handlePageChange(Number(page) + 1)}
      >
        Next
      </Button>
    </div>
  );
}
