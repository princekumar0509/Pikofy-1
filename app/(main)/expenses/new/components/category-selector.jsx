"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CategorySelector({ categories, onChange, value }) {
  // Use value prop if provided, otherwise use internal state
  const [internalValue, setInternalValue] = useState("");
  const selectedCategory = value !== undefined ? value : internalValue;

  // Handle when a category is selected
  const handleCategoryChange = (categoryId) => {
    if (value === undefined) {
      setInternalValue(categoryId);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(categoryId);
    }
  };

  // If no categories or empty categories array
  if (!categories || categories.length === 0) {
    return <div>No categories available</div>;
  }

  // Get the selected category to display its icon
  const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);

  return (
    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
      <SelectTrigger className="w-full h-11 border-0 focus:ring-0 focus:ring-offset-0">
        <SelectValue placeholder="Select a category">
          {selectedCategoryObj && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                {selectedCategoryObj.icon && <selectedCategoryObj.icon className="h-4 w-4 text-primary" />}
              </div>
              <span className="font-medium">{selectedCategoryObj.name}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <SelectItem 
              key={category.id} 
              value={category.id}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2.5 py-1">
                <div className="p-1.5 rounded-md bg-primary/10">
                  {IconComponent && <IconComponent className="h-4 w-4 text-primary" />}
                </div>
                <span className="font-medium">{category.name}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}