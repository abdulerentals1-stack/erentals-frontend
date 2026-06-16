import { fetchTagsISR } from "@/services/tag";
import TagsListClient from "./TagsListClient";

export default async function TagsList() {
  let AllTags = [];
  try {
    const res = await fetchTagsISR();
    AllTags = res?.data?.tags || [];
  } catch (err) {
    console.error("Failed to fetch tags in TagsList component:", err);
  }

  if (!AllTags.length) return null;

  return <TagsListClient tags={AllTags} />;
}

