import type { Day } from './types';

const modules = import.meta.glob<{ default: Day }>('./schedule/day-*.tsx', {
  eager: true,
});

export const schedule: Day[] = Object.keys(modules)
  .sort()
  .map((path) => modules[path].default);
