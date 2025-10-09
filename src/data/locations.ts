export interface DisposalLocation {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  openingHours: string;
  phone?: string;
  acceptedMaterials: string[];
  category: WasteCategory[];
  description: string;
}

export type WasteCategory = 
  | "Pilhas e Baterias"
  | "Pequenos Eletrônicos"
  | "Computadores e Periféricos"
  | "Eletrodomésticos Grandes"
  | "Cabos e Acessórios"
  | "Celulares e Tablets";

export const disposalLocations: DisposalLocation[] = [
  {
    id: 1,
    name: "Ecoponto Central Penha",
    address: "Av. Nereu Ramos, 1500 - Centro, Penha - SC",
    lat: -26.7689,
    lng: -48.6428,
    openingHours: "Seg-Sex: 8h-18h, Sáb: 8h-12h",
    phone: "(47) 3345-1234",
    acceptedMaterials: ["Pilhas", "Baterias", "Celulares", "Computadores", "Periféricos", "Cabos"],
    category: ["Pilhas e Baterias", "Pequenos Eletrônicos", "Computadores e Periféricos", "Celulares e Tablets", "Cabos e Acessórios"],
    description: "Principal ponto de coleta de eletrônicos da cidade. Aceita praticamente todos os tipos de resíduos eletrônicos."
  },
  {
    id: 2,
    name: "Supermercado Verde",
    address: "Rua João Pessoa, 890 - Armação, Penha - SC",
    lat: -26.7750,
    lng: -48.6380,
    openingHours: "Seg-Dom: 7h-22h",
    phone: "(47) 3345-5678",
    acceptedMaterials: ["Pilhas", "Baterias", "Lâmpadas"],
    category: ["Pilhas e Baterias"],
    description: "Ponto de coleta de pilhas e baterias. Localizado próximo ao caixa do supermercado."
  },
  {
    id: 3,
    name: "Loja TecMundo",
    address: "Av. Atlântica, 2340 - Praia de Armação, Penha - SC",
    lat: -26.7820,
    lng: -48.6450,
    openingHours: "Seg-Sáb: 9h-19h",
    phone: "(47) 3345-9012",
    acceptedMaterials: ["Celulares", "Tablets", "Acessórios", "Cabos", "Fones de ouvido"],
    category: ["Celulares e Tablets", "Pequenos Eletrônicos", "Cabos e Acessórios"],
    description: "Especializada em celulares e tablets. Aceita aparelhos antigos para reciclagem."
  },
  {
    id: 4,
    name: "Centro de Reciclagem Municipal",
    address: "Rua dos Trabalhadores, 450 - Gravatá, Penha - SC",
    lat: -26.7650,
    lng: -48.6500,
    openingHours: "Seg-Sex: 7h-17h",
    phone: "(47) 3345-2000",
    acceptedMaterials: ["Geladeiras", "Fogões", "Máquinas de lavar", "Ar-condicionado", "Micro-ondas"],
    category: ["Eletrodomésticos Grandes"],
    description: "Centro municipal especializado em eletrodomésticos de grande porte. Agendamento recomendado."
  },
  {
    id: 5,
    name: "Farmácia Saúde+",
    address: "Rua São Pedro, 120 - Centro, Penha - SC",
    lat: -26.7700,
    lng: -48.6410,
    openingHours: "Seg-Sex: 8h-20h, Sáb: 8h-14h",
    phone: "(47) 3345-3456",
    acceptedMaterials: ["Pilhas", "Baterias"],
    category: ["Pilhas e Baterias"],
    description: "Ponto de coleta conveniente para pilhas e baterias pequenas."
  },
  {
    id: 6,
    name: "Informática Plus",
    address: "Av. Brasil, 678 - Centro, Penha - SC",
    lat: -26.7710,
    lng: -48.6395,
    openingHours: "Seg-Sex: 9h-18h, Sáb: 9h-13h",
    phone: "(47) 3345-7890",
    acceptedMaterials: ["Computadores", "Notebooks", "Monitores", "Teclados", "Mouses", "Impressoras"],
    category: ["Computadores e Periféricos", "Cabos e Acessórios"],
    description: "Assistência técnica que aceita equipamentos de informática para descarte adequado."
  }
];

export const wasteCategories: WasteCategory[] = [
  "Pilhas e Baterias",
  "Pequenos Eletrônicos",
  "Computadores e Periféricos",
  "Eletrodomésticos Grandes",
  "Cabos e Acessórios",
  "Celulares e Tablets"
];
