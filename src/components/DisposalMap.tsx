import { useEffect, useRef } from "react";
import { DisposalLocation } from "@/data/locations";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface DisposalMapProps {
  locations: DisposalLocation[];
  center?: [number, number];
  zoom?: number;
}

const DisposalMap = ({ locations, center = [-26.7689, -48.6428], zoom = 13 }: DisposalMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    } else {
      // Se o mapa já existe, apenas muda a visão para o novo centro
      mapInstanceRef.current.setView(center, zoom);
    }

    // Limpa marcadores existentes
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });

    const customIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Adiciona novos marcadores
    locations.forEach((location) => {
      if(location.lat && location.lng) {
        const marker = L.marker([location.lat, location.lng], { icon: customIcon })
          .addTo(mapInstanceRef.current!);
        
        const popupContent = `
          <div class="p-3 max-w-sm">
            <h3 class="font-bold text-lg mb-2">${location.name}</h3>
            <p class="text-sm text-gray-600 mb-3">${location.address}</p>
            <p class="text-sm text-gray-600 mb-3"><strong>Horários:</strong> ${location.openingHours}</p>
          </div>
        `;
        marker.bindPopup(popupContent, { maxWidth: 400 });
      }
    });

  }, [locations, center, zoom]);

  return <div ref={mapRef} className="h-full w-full rounded-xl shadow-lg" />;
};

export default DisposalMap;