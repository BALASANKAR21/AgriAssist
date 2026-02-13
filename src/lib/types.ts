import type { AgriculturalRecommendationsOutput } from "@/ai/flows/agricultural-recommendations";

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

export type AIInsight = AgriculturalRecommendationsOutput;
