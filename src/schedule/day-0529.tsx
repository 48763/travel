import type { Day } from '../types';

const day: Day = {
  date: '2026-05-29',
  events: [
    {
      time: '06:00',
      title: '早餐時間',
      details: '最晚用餐時間 10:00',
      type: 'food'
    },
    {
      time: '10:00',
      title: '退房手續',
      details: '最晚退房時間 11:00\n寄存行李',
      type: 'luggage'
    },
    {
      time: '10:00',
      title: 'Pokémon GO Fest 公園遊記',
      details: '本次旅程的主要活動內容。',
      address: '東京都千代田区日比谷公園',
      type: 'activity'
    },
    {
      time: '22:00',
      title: '入住 濱松町京王布萊索飯店',
      details: 'Keio Presso Inn Hamamatsucho',
      address: '東京都港区浜松町1丁目18-11',
      type: 'hotel'
    }
  ]
};

export default day;
