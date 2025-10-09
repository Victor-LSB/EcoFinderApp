import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
}

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Buscar item (ex: pilhas, celular, computador...)",
  suggestions = []
}: SearchBarProps) => {
  const [open, setOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim()) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setOpen(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setOpen(false);
    }
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (value.trim() && filteredSuggestions.length > 0) {
            setOpen(true);
          }
        }}
        placeholder={placeholder}
        className="pl-12 h-14 text-base bg-card border-2 border-border focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
      />
      
      {open && filteredSuggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full z-50">
          <Command className="rounded-lg border shadow-md bg-popover">
            <CommandList>
              <CommandEmpty>Nenhuma sugestão encontrada.</CommandEmpty>
              <CommandGroup heading="Sugestões">
                {filteredSuggestions.map((suggestion, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => handleSuggestionClick(suggestion)}
                    className="cursor-pointer"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {suggestion}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
