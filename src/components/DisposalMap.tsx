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

    // Initialize map only once
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });

    // Custom green icon
    const customIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Add markers for each location
    locations.forEach((location) => {
      const marker = L.marker([location.lat, location.lng], { icon: customIcon })
        .addTo(mapInstanceRef.current!);

      // Create popup content
      const popupContent = `
        <div class="p-3 max-w-sm">
          <h3 class="font-bold text-lg mb-2 flex items-start gap-2">
            <svg class="h-5 w-5 text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>${location.name}</span>
          </h3>
          <p class="text-sm text-gray-600 mb-3">${location.address}</p>
          <div class="flex items-start gap-2 text-sm mb-2">
            <svg class="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>${location.openingHours}</span>
          </div>
          ${location.phone ? `
            <div class="flex items-center gap-2 text-sm mb-3">
              <svg class="h-4 w-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <a href="tel:${location.phone}" class="text-primary hover:underline">${location.phone}</a>
            </div>
          ` : ''}
          <div class="mb-2">
            <div class="flex items-center gap-2 text-sm font-medium mb-1">
              <svg class="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span>Materiais aceitos:</span>
            </div>
            <div class="flex flex-wrap gap-1">
              ${location.acceptedMaterials.map(material => 
                `<span class="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">${material}</span>`
              ).join('')}
            </div>
          </div>
          <p class="text-sm text-gray-600 leading-relaxed mt-2">${location.description}</p>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 400 });
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations, center, zoom]);

  return <div ref={mapRef} className="h-full w-full rounded-xl shadow-lg" />;
};

export default DisposalMap;
