import type { ReactNode } from 'react';

export interface Line {
  name: string;
  color: string;
  textColor?: string;
  description: string;
}

export interface Event {
  time?: string;
  title: string;
  details?: string;
  address?: string;
  icon: ReactNode;
  iconColor: string;
  lines?: Line[];
}

export interface Day {
  date: string;
  events: Event[];
}
