import type { Day } from '../types';

const day: Day = {
  date: '2026-05-01',
  events: [
    {
      type: 'activity',
      time: '10:00',
      title: '[測試] 明天的活動',
      details: '驗證 future 樣式：應該不淡化、無今日標',
      address: '東京都千代田区日比谷公園',
    },
    {
      type: 'walking',
      time: '15:00',
      title: '[測試] 明天的散步',
      details: '驗證 walking 類型 icon',
    },
  ],
};

export default day;
