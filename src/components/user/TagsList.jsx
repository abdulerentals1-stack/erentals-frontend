import Link from "next/link";
import { getAllTags } from "@/services/tag";

export default async function TagsList() {
  const res = await getAllTags();
  const AllTags = res?.data?.tags || [];

  if (!AllTags.length) return null;

  return (
<div className="
  min-h-16 border-b w-full 
  flex items-center gap-3 
  px-2 sm:px-12 md:px-16 lg:px-12 2xl:px-28
  overflow-x-scroll lg:overflow-x-visible 
  scrollbar-hide justify-between">
  {AllTags.map((tag) => (
    <Link
      key={tag._id}
      href={`/tags/${tag.slug}`}
      className="px-4 py-2 whitespace-nowrap sm:whitespace-normal rounded-full bg-[#f3f9fb] hover:bg-gray-200 transition text-sm font-xs shrink-0"
    >
      {tag.name}
    </Link>
  ))}
</div>


  );
}
