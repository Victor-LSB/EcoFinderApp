import { Lightbulb, AlertCircle, Recycle, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tips = [
  {
    icon: AlertCircle,
    title: "Por que descartar corretamente?",
    description: "Equipamentos eletrônicos contêm metais pesados como chumbo, mercúrio e cádmio. Se descartados incorretamente, podem contaminar o solo e a água."
  },
  {
    icon: Recycle,
    title: "Recicle, não jogue fora",
    description: "95% dos materiais de um eletrônico podem ser reciclados. Metais preciosos e plásticos podem ter nova vida quando descartados corretamente."
  },
  {
    icon: ShieldCheck,
    title: "Apague seus dados",
    description: "Antes de descartar celulares e computadores, faça backup e apague todos os dados pessoais para proteger sua privacidade."
  },
  {
    icon: Lightbulb,
    title: "Doe se funcionar",
    description: "Se o equipamento ainda funciona, considere doar para escolas, ONGs ou pessoas que possam aproveitá-lo antes de descartá-lo."
  }
];

const EducationalSection = () => {
  return (
    <section className="py-16 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Descarte Consciente
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aprenda sobre a importância do descarte correto de lixo eletrônico
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tips.map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{tip.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {tip.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EducationalSection;
