export type Expense = {
  id: string;
  item: string;
  category: string;
  amount: number;
  currency: 'INR';
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

export type MarketPrice = {
  date: string;
  price: number; // Price per Quintal in INR
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
