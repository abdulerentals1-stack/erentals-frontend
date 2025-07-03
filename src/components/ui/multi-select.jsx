// src/components/ui/multi-select.tsx
'use client';

import { useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MultiSelect({ options = [], value = [], onChange }) {
  const [open, setOpen] = useState(false);

  const toggleOption = (val) => {
    const newValue = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val];
    onChange(newValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
        >
          {value.length > 0
            ? `${value.length} selected`
            : "Select options"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-2">
        <ScrollArea className="h-48">
          {options.map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2 py-1 px-2 rounded-md hover:bg-accent cursor-pointer">
              <Checkbox
                id={opt.value}
                checked={value.includes(opt.value)}
                onCheckedChange={() => toggleOption(opt.value)}
              />
              <label
                htmlFor={opt.value}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {opt.label}
              </label>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
