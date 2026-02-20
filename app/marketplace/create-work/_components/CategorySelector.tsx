import React from "react";
import { Edit2 } from "lucide-react";

interface CategorySelectorProps<T> {
  categories: string[];
  selectedCategory: string;
  setValue: (
    name: keyof T,
    value: any,
    options?: { shouldValidate: boolean }
  ) => void;
  errorMessage?: string;
}

const CategorySelector = <T,>({
  categories,
  selectedCategory,
  setValue,
  errorMessage,
}: CategorySelectorProps<T>) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Edit2 size={20} className="text-green-600" />
        Choose a category for your work
      </h3>
      <div className="flex flex-wrap gap-4">
        {categories.map((category, index) => (
          <button
            key={index}
            type="button"
            className={`font-semibold px-4 py-2 rounded-md transition ${
              selectedCategory === category
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-green-100"
            }`}
            onClick={() =>
              setValue("category" as keyof T, category, {
                shouldValidate: true,
              })
            }
          >
            {category}
          </button>
        ))}
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default CategorySelector;
