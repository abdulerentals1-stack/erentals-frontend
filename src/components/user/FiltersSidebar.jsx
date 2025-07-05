"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/services/category";
import { getAllTags } from "@/services/tag";
import { Filter, X } from "lucide-react";

export default function FiltersSidebar({ searchParams, path = "/product-search" }) {
  const router = useRouter();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.search || "");
  const [categories, setCategories] = useState(searchParams.categories?.split(",") || []);
  const [tags, setTags] = useState(searchParams.tags?.split(",") || []);
  const [min, setMin] = useState(searchParams.min || "");
  const [max, setMax] = useState(searchParams.max || "");
  const [sort, setSort] = useState(searchParams.sort || "priceAsc");

  const [allCategories, setAllCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    getAllCategories().then((res) => setAllCategories(res.data.categories));
    getAllTags().then((res) => setAllTags(res.data.tags));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(categories.length && { categories: categories.join(",") }),
        ...(tags.length && { tags: tags.join(",") }),
        ...(min && { min }),
        ...(max && { max }),
        ...(sort && { sort }),
      });
      router.replace(`${path}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, categories, tags, min, max, sort]);

  const toggleSelection = (value, setFn, list) => {
    if (list.includes(value)) {
      setFn(list.filter((v) => v !== value));
    } else {
      setFn([...list, value]);
    }
  };

  const FilterFields = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="sort">Sort By</Label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full mt-1 border rounded px-2 py-1"
        >
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="min">Min Price</Label>
          <Input
            id="min"
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="₹"
          />
        </div>
        <div>
          <Label htmlFor="max">Max Price</Label>
          <Input
            id="max"
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder="₹"
          />
        </div>
      </div>

      <div>
        <Label>Categories</Label>
        <div className="space-y-2 pt-2 pr-2">
          {allCategories.map((cat) => (
            <div key={cat._id} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${cat._id}`}
                checked={categories.includes(cat._id)}
                onCheckedChange={() =>
                  toggleSelection(cat._id, setCategories, categories)
                }
              />
              <Label htmlFor={`cat-${cat._id}`}>{cat.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Tags</Label>
        <div className="space-y-2 pt-2 pr-2">
          {allTags.map((tag) => (
            <div key={tag._id} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag.name}`}
                checked={tags.includes(tag.name)}
                onCheckedChange={() =>
                  toggleSelection(tag.name, setTags, tags)
                }
              />
              <Label htmlFor={`tag-${tag.name}`}>{tag.name}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ✅ Mobile Filter Toggle Button */}
      <div className="md:hidden flex justify-end mb-4">
        <Button
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => setShowMobileFilters(true)}
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* ✅ Mobile Filter Drawer Panel */}
      {showMobileFilters && (
        <>
          <div className="inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className=" bottom-0 left-0 right-0 z-50 bg-white rounded-t-xl p-4 max-h-[90vh] overflow-y-auto animate-slide-up border-t">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" onClick={() => setShowMobileFilters(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            {FilterFields()}
          </div>
        </>
      )}

      {/* ✅ Desktop Filters Sidebar */}
      <div className="hidden md:block space-y-6 shadow-md py-4 px-4">
        {FilterFields()}
      </div>

      {/* ✅ Slide animation */}
      <style jsx global>{`
        @keyframes slide-up {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0%);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
