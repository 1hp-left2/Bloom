export function todayISO(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function addDaysISO(date: string, days: number): string {
  const current = new Date(`${date}T00:00:00.000Z`);
  current.setUTCDate(current.getUTCDate() + days);
  return todayISO(current);
}

export function daysBetween(start: string, end: string): number {
  const startDate = new Date(`${start}T00:00:00.000Z`).getTime();
  const endDate = new Date(`${end}T00:00:00.000Z`).getTime();
  return Math.round((endDate - startDate) / 86400000);
}

export function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
