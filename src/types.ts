export type EventType =
  | 'planeDeparture'
  | 'planeArrival'
  | 'train'
  | 'schedule'
  | 'hotel'
  | 'food'
  | 'shopping'
  | 'activity'
  | 'pachinko'
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
  /**
   * 確切的 Google Maps 連結（分享網址或 place 連結）。
   * 有填時，address 文字直接連到這個確切位置；沒填才退回用 address 搜尋。
   */
  mapUrl?: string;
  lines?: Line[];
}

export interface Day {
  date: string;
  events: Event[];
}
