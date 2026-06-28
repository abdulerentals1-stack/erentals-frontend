"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TagsListClient({ tags }) {
  const pathname = usePathname();

  return (
    <div className="
      sticky top-16 md:top-[5.2rem] z-40
      min-h-16 border-b w-full bg-white dark:bg-zinc-900
      flex items-center gap-3 
      px-2 sm:px-12 md:px-16 lg:px-12 2xl:px-28
      overflow-x-auto lg:overflow-x-visible 
      no-scrollbar justify-between">
      {tags.map((tag) => {
        const isActive = pathname === `/tags/${tag.slug}`;

        return (
          <Link
            key={tag._id}
            href={`/tags/${tag.slug}`}
            className={`px-4 py-2 whitespace-nowrap rounded-full border transition-all duration-200 text-sm font-medium shrink-0 cursor-pointer shadow-sm ${
              isActive
                ? "bg-[#003459] text-white border-[#003459] hover:bg-[#002845]"
                : "bg-[#f3f9fb] text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-black dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700"
            }`}
          >
            {tag.name}
          </Link>
        );
      })}
    </div>
  );
}
