export type EventType =
  | 'planeDeparture'
  | 'planeArrival'
  | 'train'
  | 'schedule'
  | 'hotel'
  | 'food'
  | 'shopping'
  | 'activity'
  | 'walking'
  | 'luggage'
  | 'social'
  | 'unknown';

export interface Line {
  name: string;
  color: string;
  textColor?: string;
  description: string;
}

export interface Event {
  type: EventType;
  time?: string;
  title: string;
  details?: string | string[];
  address?: string;
  lines?: Line[];
}

export interface Day {
  date: string;
  events: Event[];
}
