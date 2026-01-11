
export const FONTS = [
  { name: 'Classic Serif', class: 'serif' },
  { name: 'Modern Sans', class: 'font-sans' },
  { name: 'Cursive Script', class: 'handwritten' },
  { name: 'Monospace', class: 'font-mono' }
];

export const PAPER_TYPES = [
  { name: 'Parchment', class: 'bg-[#f4e4bc] border-[#d4c49c]' },
  { name: 'Clean White', class: 'bg-white border-gray-200' },
  { name: 'Cotton Blue', class: 'bg-[#ebf4f5] border-[#c4d4d5]' },
  { name: 'Rose Petal', class: 'bg-[#fff0f3] border-[#ffd6e0]' }
];

export const STAMP_DESIGNS = [
  '🕊️', '✉️', '🌹', '🌿', '✨', '🕯️', '🎻', '☕', '📜', '🎐'
];

export const calculateDeliveryTimeMs = (distanceKm: number): number => {
  // 1/100 hr per km = 1 hr per 100 km
  // Time in hours = distance / 100
  // Time in ms = (distance / 100) * 60 * 60 * 1000
  return (distanceKm / 100) * 60 * 60 * 1000;
};

export const MOCK_CONTACTS = [
  { id: '1', name: 'Alice Wonder', avatar: 'https://picsum.photos/seed/alice/100', location: 'London, UK', distanceKm: 450 },
  { id: '2', name: 'Bob Builder', avatar: 'https://picsum.photos/seed/bob/100', location: 'Tokyo, Japan', distanceKm: 9500 },
  { id: '3', name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/charlie/100', location: 'New York, USA', distanceKm: 5600 },
  { id: '4', name: 'Diana Prince', avatar: 'https://picsum.photos/seed/diana/100', location: 'Paris, France', distanceKm: 210 }
];
