const pad = (n: number) => String(n).padStart(2, '0');

export const TRIP = {
  title: '日本旅遊時程',
  year: 2026,
  startMonth: 5,
  accent: '#e67e22',
} as const;

export const d = (month: number, day: number): string => {
  const year = month < TRIP.startMonth ? TRIP.year + 1 : TRIP.year;
  return `${year}-${pad(month)}-${pad(day)}`;
};
