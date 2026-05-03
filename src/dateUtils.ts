const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${m}/${dd} (${WEEKDAYS[d.getDay()]})`;
}

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export type DayStatus = 'past' | 'today' | 'future';

export function dayStatus(iso: string, today: string): DayStatus {
  if (iso < today) return 'past';
  if (iso === today) return 'today';
  return 'future';
}
