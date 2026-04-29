import type { Day } from '../types';

const day: Day = {
  date: '2026-06-06',
  events: [
    {
      time: '10:00',
      title: '退房手續',
      details: '最晚退房時間 11:00',
      type: 'luggage'
    },
    {
      time: '全天',
      title: '休閒行程',
      details: '本日為休閒時間，輕鬆探索。',
      type: 'walking'
    }
  ]
};

export default day;
