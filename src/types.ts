export type PropertyCategory = 'todas' | 'playa' | 'campo' | 'penthouse';

export interface Property {
  id: string;
  reference: string;
  title: string;
  category: 'playa' | 'campo' | 'penthouse';
  categoryLabel: string;
  location: string;
  country: string;
  price: string;
  status: string;
  accent: string;
  imageUrl: string;
  specs: {
    builtArea: string;
    plotArea?: string;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
  };
  summary: string;
  editorial: string;
}

export interface RealEstateService {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  accent: string;
  tag: string;
}

export interface OfficeLocation {
  city: string;
  role: string;
  address: string;
  phone: string;
  email: string;
  schedule: string;
}

export interface AdvisoryInquiry {
  intent: 'comprar' | 'vender' | 'patrimonio' | 'off-market';
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  budgetRange: string;
  notes: string;
}

export interface TourRoom {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  frameStart: number;
  frameEnd: number;
  altitude: string;
  orientation: string;
  area: string;
  description: string;
  highlights: string[];
  materials: string[];
  hotspots: {
    label: string;
    detail: string;
  }[];
}
