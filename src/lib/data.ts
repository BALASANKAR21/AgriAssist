import type { Expense, PestAlert, ImagePlaceholder, MarketPrice, GovernmentScheme, CropInfo } from './types';

export const mockExpenses: Expense[] = [
  { id: '1', item: 'Corn Seeds', category: 'Seeds', amount: 3500, currency: 'INR', date: new Date('2024-05-01') },
  { id: '2', item: 'Tractor Fuel', category: 'Fuel', amount: 2500, currency: 'INR', date: new Date('2024-05-03') },
  { id: '3', item: 'Nitrogen Fertilizer', category: 'Fertilizer', amount: 8000, currency: 'INR', date: new Date('2024-05-05') },
  { id: '4', item: 'Part-time labor', category: 'Labor', amount: 10000, currency: 'INR', date: new Date('2024-05-10') },
];

export const mockPestAlerts: PestAlert[] = [
    {
        id: 'pa1',
        pestName: 'Corn Earworm',
        location: { lat: 28.6139, lng: 77.2090 },
        reportedAt: new Date('2024-05-20T10:00:00Z'),
        severity: 'High',
        description: 'Large infestation found in the north-west quadrant of the field.'
    },
    {
        id: 'pa2',
        pestName: 'Aphids',
        location: { lat: 28.6200, lng: 77.2150 },
        reportedAt: new Date('2024-05-19T15:30:00Z'),
        severity: 'Medium',
        description: 'Small clusters of aphids on the underside of leaves.'
    },
];

export const mockMarketPrices: MarketPrice[] = [
  { date: '2024-05-01', price: 2200 },
  { date: '2024-05-02', price: 2250 },
  { date: '2024-05-03', price: 2230 },
  { date: '2024-05-04', price: 2300 },
  { date: '2024-05-05', price: 2350 },
  { date: '2024-05-06', price: 2400 },
  { date: '2024-05-07', price: 2380 },
  { date: '2024-05-08', price: 2450 },
  { date: '2024-05-09', price: 2500 },
  { date: '2024-05-10', price: 2470 },
];

export const mockGovSchemes: GovernmentScheme[] = [
    { id: 'gs1', title: 'PM-KISAN Scheme', description: 'Income support to all landholding farmer families.', howToApply: 'Register on the PM-KISAN portal with your Aadhaar and land details.' },
    { id: 'gs2', title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)', description: 'Crop insurance against yield losses.', howToApply: 'Contact your nearest bank or insurance company during the enrollment period.' },
    { id: 'gs3', title: 'Soil Health Card Scheme', description: 'Provides farmers with information on the nutrient status of their soil.', howToApply: 'Contact the local agricultural department to get your soil tested.' },
];

export const mockCropData: CropInfo[] = [
    { id: 'c1', name: 'Wheat' },
    { id: 'c2', name: 'Rice' },
    { id: 'c3', name: 'Corn' },
    { id: 'c4', name: 'Sugarcane' },
    { id: 'c5', name: 'Cotton' },
]

export const mockPlaceholderImages: ImagePlaceholder[] = [
  {
    id: 'voice-ledger',
    description: 'A person writing in a ledger book in a field.',
    imageUrl: 'https://picsum.photos/seed/1/600/400',
    imageHint: 'farm ledger'
  },
  {
    id: 'pest-alert',
    description: 'A magnifying glass over a leaf with a bug on it.',
    imageUrl: 'https://picsum.photos/seed/2/600/400',
    imageHint: 'pest inspection'
  },
  {
    id: 'ai-insights',
    description: 'Abstract representation of data and charts over a farm background.',
    imageUrl: 'https://picsum.photos/seed/3/600/400',
    imageHint: 'data analytics'
  }
];
