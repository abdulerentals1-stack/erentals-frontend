"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaginationControls({ page, limit, total, path, searchParams }) {
  const totalPages = Math.ceil(total / limit);

  const getPageUrl = (pageNum) => {
    const query = new URLSearchParams(searchParams);
    query.set("page", pageNum);
    return `${path}?${query.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
      {/* Previous Button */}
      {Number(page) <= 1 ? (
        <Button size="sm" variant="outline" disabled>
          Previous
        </Button>
      ) : (
        <Button size="sm" variant="outline" asChild>
          <Link href={getPageUrl(Number(page) - 1)} className="cursor-pointer">
            Previous
          </Link>
        </Button>
      )}

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, index) => {
        const pageNum = index + 1;
        const isCurrent = Number(page) === pageNum;

        return isCurrent ? (
          <Button
            key={pageNum}
            size="sm"
            variant="default"
            className="cursor-default"
          >
            {pageNum}
          </Button>
        ) : (
          <Button
            key={pageNum}
            size="sm"
            variant="outline"
            asChild
          >
            <Link href={getPageUrl(pageNum)} className="cursor-pointer">
              {pageNum}
            </Link>
          </Button>
        );
      })}

      {/* Next Button */}
      {Number(page) >= totalPages ? (
        <Button size="sm" variant="outline" disabled>
          Next
        </Button>
      ) : (
        <Button size="sm" variant="outline" asChild>
          <Link href={getPageUrl(Number(page) + 1)} className="cursor-pointer">
            Next
          </Link>
        </Button>
      )}
    </div>
  );
}
