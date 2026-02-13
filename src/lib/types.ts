export type Expense = {
  id: string;
  item: string;
  category: string;
  amount: number;
  currency: string;
  date: Date;
};

export type PestAlert = {
    id: string;
    pestName: string;
    location: { lat: number; lng: number };
    reportedAt: Date;
    severity: 'Low' | 'Medium' | 'High';
    description: string;
};

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export type AIInsight = {
    summary: string;
    recommendations: {
        category: string;
        advice: string;
        potentialImpact?: string;
    }[];
    contextualDetails?: string;
};

export type MarketPrice = {
  date: string;
  price: number;
};

export type GovernmentScheme = {
  id: string;
  title: string;
  description: string;
  howToApply: string;
};

export type CropInfo = {
    id: string;
    name: string;
};
