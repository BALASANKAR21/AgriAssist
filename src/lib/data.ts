import type { Expense, PestAlert, ImagePlaceholder } from './types';

export const mockExpenses: Expense[] = [
  { id: '1', item: 'Corn Seeds', category: 'Seeds', amount: 150.75, currency: 'USD', date: new Date('2024-05-01') },
  { id: '2', item: 'Tractor Fuel', category: 'Fuel', amount: 85.20, currency: 'USD', date: new Date('2024-05-03') },
  { id: '3', item: 'Nitrogen Fertilizer', category: 'Fertilizer', amount: 320.00, currency: 'USD', date: new Date('2024-05-05') },
  { id: '4', item: 'Part-time labor', category: 'Labor', amount: 200.00, currency: 'USD', date: new Date('2024-05-10') },
];

export const mockPestAlerts: PestAlert[] = [
    {
        id: 'pa1',
        pestName: 'Corn Earworm',
        location: { lat: 34.0522, lng: -118.2437 },
        reportedAt: new Date('2024-05-20T10:00:00Z'),
        severity: 'High',
        description: 'Large infestation found in the north-west quadrant of the field.'
    },
    {
        id: 'pa2',
        pestName: 'Aphids',
        location: { lat: 34.0580, lng: -118.2400 },
        reportedAt: new Date('2024-05-19T15:30:00Z'),
        severity: 'Medium',
        description: 'Small clusters of aphids on the underside of leaves.'
    },
    {
        id: 'pa3',
        pestName: 'Spider Mites',
        location: { lat: 34.0500, lng: -118.2500 },
        reportedAt: new Date('2024-05-21T09:00:00Z'),
        severity: 'Low',
        description: 'Webbing noticed on a few plants. Keeping an eye on it.'
    }
];

export const placeholderImages: ImagePlaceholder[] = [
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
