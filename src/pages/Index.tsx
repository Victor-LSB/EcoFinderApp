import { useState, useMemo, useCallback } from "react";
import { Leaf, MapPin, Search as SearchIcon } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import DisposalMap from "@/components/DisposalMap";
import LocationCard from "@/components/LocationCard";
import EducationalSection from "@/components/EducationalSection";
import { disposalLocations as initialDisposalLocations, wasteCategories, WasteCategory, DisposalLocation } from "@/data/locations";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

// Chave da API do Google Maps a partir das variáveis de ambiente
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("Penha, SC");
  const [selectedCategories, setSelectedCategories] = useState<WasteCategory[]>([]);
  const [showMap, setShowMap] = useState(true);
  const [locations, setLocations] = useState<DisposalLocation[]>(initialDisposalLocations);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-26.7689, -48.6428]);
  const [isSearching, setIsSearching] = useState(false);

  // Criar lista de sugestões única de todos os materiais aceitos
  const allSuggestions = useMemo(() => {
    const materials = new Set<string>();
    materials.add("Lixo eletrônico"); // Adicionar opção para mostrar todos

    initialDisposalLocations.forEach(location => {
      location.acceptedMaterials.forEach(material => {
        materials.add(material);
      });
    });

    return Array.from(materials).sort();
  }, []);


  const handleSearchCity = useCallback(async () => {
    if (!cityQuery) {
      toast.error("Por favor, digite uma cidade para buscar.");
      return;
    }
    if (!GOOGLE_MAPS_API_KEY) {
      toast.error("A chave da API do Google não foi configurada.");
      console.error("VITE_GOOGLE_MAPS_API_KEY is not set in .env file");
      return;
    }

    setIsSearching(true);
    toast.info(`Buscando locais em ${cityQuery}...`);

    try {
      // 1. Geocodificar o nome da cidade para obter coordenadas (usando proxy)
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        cityQuery
      )}&key=${GOOGLE_MAPS_API_KEY}`;
      const geocodeProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(geocodeUrl)}`;
      const geocodeResponse = await fetch(geocodeProxyUrl);
      const geocodeProxyData = await geocodeResponse.json();
      const geocodeData = JSON.parse(geocodeProxyData.contents);

      if (geocodeData.status !== "OK" || !geocodeData.results[0]) {
        console.error("Geocoding API Error:", geocodeData.status, geocodeData.error_message);
        throw new Error(`Não foi possível encontrar a cidade especificada. Status: ${geocodeData.status}`);
      }

      const { lat, lng } = geocodeData.results[0].geometry.location;
      setMapCenter([lat, lng]);

      // 2. Usar o endpoint "searchText" da nova Places API
      const placesUrl = "https://places.googleapis.com/v1/places:searchText";
      
      const requestBody = {
        textQuery: `descarte de lixo eletrônico em ${cityQuery}`,
        locationBias: {
          circle: {
            center: {
              latitude: lat,
              longitude: lng,
            },
            radius: 50000.0, // Aumentado o raio para uma área de busca maior
          },
        },
        languageCode: "pt-BR",
      };

      const placesResponse = await fetch(placesUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.id,places.websiteUri,places.nationalPhoneNumber',
        },
        body: JSON.stringify(requestBody),
      });
      
      const placesData = await placesResponse.json();
      
      if (placesData.places && placesData.places.length > 0) {
        const googleLocations: DisposalLocation[] = placesData.places.map((place: any) => ({
          id: place.id,
          name: place.displayName.text,
          address: place.formattedAddress,
          lat: place.location.latitude,
          lng: place.location.longitude,
          openingHours: "Verificar horário no local", // A API searchText não retorna este dado facilmente
          phone: place.nationalPhoneNumber,
          acceptedMaterials: ["Eletrônicos"],
          category: ["Pequenos Eletrônicos", "Computadores e Periféricos", "Celulares e Tablets", "Cabos e Acessórios"],
          description: `Visite o site: ${place.websiteUri || 'Não informado'}`
        }));
        setLocations(googleLocations);
        toast.success(`${googleLocations.length} locais encontrados em ${cityQuery}.`);
      } else {
        setLocations([]);
        toast.info(`Nenhum local de descarte de eletrônicos encontrado para "${cityQuery}".`);
      }
    } catch (error) {
      console.error("Erro ao buscar locais:", error);
      toast.error(`Ocorreu um erro ao buscar os locais. Detalhes: ${error instanceof Error ? error.message : String(error)}`);
      setLocations(initialDisposalLocations);
      setMapCenter([-26.7689, -48.6428]);
    } finally {
      setIsSearching(false);
    }
  }, [cityQuery]);


  const handleCategoryToggle = (category: WasteCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredLocations = useMemo(() => {
    let filtered = locations;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      if (query === "lixo eletrônico") {
        return locations;
      }

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
  }, [searchQuery, selectedCategories, locations]);

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
                <h1 className="text-2xl font-bold text-foreground">EcoLocaliza</h1>
                <p className="text-xs text-muted-foreground">Descarte Consciente</p>
              </div>
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
            Descarte seus equipamentos de forma consciente e sustentável em qualquer cidade
          </p>
          <div className="max-w-2xl mx-auto space-y-4">
             <div className="flex flex-col sm:flex-row gap-2">
                 <Input 
                    value={cityQuery}
                    onChange={(e) => setCityQuery(e.target.value)}
                    placeholder="Digite a cidade (ex: Itajaí, SC)"
                    className="h-14 text-base"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchCity()}
                 />
                 <Button onClick={handleSearchCity} disabled={isSearching} size="lg" className="h-14">
                    <SearchIcon className="h-5 w-5 sm:mr-2" />
                    <span className="hidden sm:inline">{isSearching ? "Buscando..." : "Buscar"}</span>
                 </Button>
             </div>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Filtrar por item (ex: pilhas, celular...)"
              suggestions={allSuggestions}
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
            
            <div className="relative z-0 h-[500px] md:h-[600px] rounded-xl overflow-hidden">
              <DisposalMap locations={filteredLocations} center={mapCenter} />
            </div>
          ) : (
            <ScrollArea className="h-[500px] md:h-[600px]">
              {filteredLocations.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pb-4">
                  {filteredLocations.map((location) => (
                    <LocationCard key={location.id} location={location} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <p>Nenhum local corresponde aos filtros atuais.</p>
                </div>
              )}
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
                Desenvolvido por {" "}
                <span className="font-semibold text-primary">Victor Lucas dos Santos Bento</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                © 2025 EcoLocaliza. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;