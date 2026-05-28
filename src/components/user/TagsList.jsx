import Link from "next/link";
import { getAllTags } from "@/services/tag";

export default async function TagsList() {
  let AllTags = [];
  try {
    const res = await getAllTags();
    AllTags = res?.data?.tags || [];
  } catch (err) {
    console.error("Failed to fetch tags in TagsList component:", err);
  }

  if (!AllTags.length) return null;

  return (
    <div className="
      sticky top-16 md:top-[5.2rem] z-40
      min-h-16 border-b w-full bg-white dark:bg-zinc-900
      flex items-center gap-3 
      px-2 sm:px-12 md:px-16 lg:px-12 2xl:px-28
      overflow-x-auto lg:overflow-x-visible 
      scrollbar-hide justify-between">
      {AllTags.map((tag) => (
        <Link
          key={tag._id}
          href={`/tags/${tag.slug}`}
          className="px-4 py-2 whitespace-nowrap sm:whitespace-normal rounded-full bg-[#f3f9fb] dark:bg-zinc-800 dark:text-zinc-200 hover:bg-gray-200 dark:hover:bg-zinc-700 transition text-sm font-xs shrink-0"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}

