import { useState, useMemo, lazy, Suspense } from "react";
import { Leaf, MapPin, Search as SearchIcon } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
const DisposalMap = lazy(() => import("@/components/DisposalMap"));
import LocationCard from "@/components/LocationCard";
import EducationalSection from "@/components/EducationalSection";
import { disposalLocations, wasteCategories, WasteCategory } from "@/data/locations";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<WasteCategory[]>([]);
  const [showMap, setShowMap] = useState(true);

  const handleCategoryToggle = (category: WasteCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredLocations = useMemo(() => {
    let filtered = disposalLocations;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (location) =>
          location.name.toLowerCase().includes(query) ||
          location.address.toLowerCase().includes(query) ||
          location.acceptedMaterials.some((material) =>
            material.toLowerCase().includes(query)
          ) ||
          location.description.toLowerCase().includes(query)
      );
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((location) =>
        location.category.some((cat) => selectedCategories.includes(cat))
      );
    }

    return filtered;
  }, [searchQuery, selectedCategories]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">EcoPenha</h1>
                <p className="text-xs text-muted-foreground">Descarte Consciente</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Penha, SC</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            Encontre pontos de coleta de lixo eletrônico
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Descarte seus equipamentos eletrônicos de forma consciente e sustentável em Penha, SC
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar item (ex: pilhas, celular, computador...)"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Filters */}
          <div className="mb-6">
            <CategoryFilter
              categories={wasteCategories}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
            />
          </div>

          {/* Results count and view toggle */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredLocations.length} {filteredLocations.length === 1 ? "local encontrado" : "locais encontrados"}
            </p>
            <div className="flex gap-2">
              <Button
                variant={showMap ? "default" : "outline"}
                size="sm"
                onClick={() => setShowMap(true)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Mapa
              </Button>
              <Button
                variant={!showMap ? "default" : "outline"}
                size="sm"
                onClick={() => setShowMap(false)}
              >
                <SearchIcon className="h-4 w-4 mr-2" />
                Lista
              </Button>
            </div>
          </div>

          {/* Map or List View */}
          {showMap ? (
            <div className="h-[500px] md:h-[600px] rounded-xl overflow-hidden">
              <Suspense fallback={
                <div className="h-full w-full flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Carregando mapa...</p>
                </div>
              }>
                <DisposalMap locations={filteredLocations} />
              </Suspense>
            </div>
          ) : (
            <ScrollArea className="h-[500px] md:h-[600px]">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pb-4">
                {filteredLocations.map((location) => (
                  <LocationCard key={location.id} location={location} />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </main>

      {/* Educational Section */}
      <EducationalSection />

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              <p className="text-foreground font-medium">
                Juntos por um futuro mais sustentável
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              O descarte correto de lixo eletrônico protege o meio ambiente e a saúde pública.
              Cada pequena ação faz diferença para o nosso planeta.
            </p>
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Desenvolvido por estudantes da{" "}
                <span className="font-semibold text-primary">Univali</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                © 2025 EcoPenha. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
