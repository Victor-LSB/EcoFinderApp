import { DisposalLocation } from "@/data/locations";
import { MapPin, Clock, Phone, Recycle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LocationCardProps {
  location: DisposalLocation;
  onClose?: () => void;
}

const LocationCard = ({ location }: LocationCardProps) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl flex items-start gap-2">
          <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <span>{location.name}</span>
        </CardTitle>
        <CardDescription>{location.address}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <span className="text-foreground">{location.openingHours}</span>
        </div>
        
        {location.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <a href={`tel:${location.phone}`} className="text-primary hover:underline">
              {location.phone}
            </a>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Recycle className="h-4 w-4 text-primary" />
            <span>Materiais aceitos:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {location.acceptedMaterials.map((material) => (
              <Badge key={material} variant="secondary" className="text-xs">
                {material}
              </Badge>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {location.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
