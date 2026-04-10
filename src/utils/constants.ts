export const SEAT_CLASSES = {
  economy: { label: 'Economy', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  business: { label: 'Business', color: '#0ea5e9', bgColor: 'rgba(14, 165, 233, 0.1)' },
  first_class: { label: 'First Class', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
};

export const DESTINATIONS = {
  MOON: 'Moon',
  MARS: 'Mars',
  ISS: 'International Space Station (ISS)',
};

export const TEST_CARD = '4242 4242 4242 4242';

export const REFUND_TIERS = [
  { days: 30, percentage: 100, label: '30+ days: 100% refund' },
  { days: 15, percentage: 75, label: '15-30 days: 75% refund' },
  { days: 7, percentage: 50, label: '7-15 days: 50% refund' },
  { days: 0, percentage: 25, label: '<7 days: 25% refund' },
];

export const DESTINATION_IMAGES: Record<string, string> = {
  Moon: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=800&q=80',
  Mars: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80',
  'International Space Station (ISS)': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80',
};
