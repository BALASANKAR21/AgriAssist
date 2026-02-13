import type { Expense, PestAlert, MarketPrice, GovernmentScheme, CropInfo } from './types';

// All amounts are in INR
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

// Price per Quintal (100 kg) in INR
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

// These use translation keys, the actual text is in the locale files.
export const mockGovSchemes: GovernmentScheme[] = [
    { id: 'gs1', title: 'scheme1_title', description: 'scheme1_desc', howToApply: 'scheme1_apply' },
    { id: 'gs2', title: 'scheme2_title', description: 'scheme2_desc', howToApply: 'scheme2_apply' },
    { id: 'gs3', title: 'scheme3_title', description: 'scheme3_desc', howToApply: 'scheme3_apply' },
];

export const mockCropData: CropInfo[] = [
    { id: 'c1', name: 'Wheat' },
    { id: 'c2', name: 'Rice' },
    { id: 'c3', name: 'Corn' },
    { id: 'c4', name: 'Sugarcane' },
    { id: 'c5', name: 'Cotton' },
]
