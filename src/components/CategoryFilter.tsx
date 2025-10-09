import { Badge } from "@/components/ui/badge";
import { WasteCategory } from "@/data/locations";
import { Filter } from "lucide-react";

interface CategoryFilterProps {
  categories: WasteCategory[];
  selectedCategories: WasteCategory[];
  onCategoryToggle: (category: WasteCategory) => void;
}

const CategoryFilter = ({ categories, selectedCategories, onCategoryToggle }: CategoryFilterProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Filter className="h-4 w-4" />
        <span>Filtrar por categoria</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <Badge
              key={category}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all hover:scale-105 ${
                isSelected 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "hover:bg-secondary"
              }`}
              onClick={() => onCategoryToggle(category)}
            >
              {category}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
