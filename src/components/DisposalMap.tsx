import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { DisposalLocation } from "@/data/locations";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import LocationCard from "./LocationCard";

interface DisposalMapProps {
  locations: DisposalLocation[];
  center?: [number, number];
  zoom?: number;
}

const customIcon = new Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DisposalMap = ({ locations, center = [-26.7689, -48.6428], zoom = 13 }: DisposalMapProps) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full rounded-xl shadow-lg z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={customIcon}
        >
          <Popup className="custom-popup" maxWidth={400}>
            <LocationCard location={location} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DisposalMap;
