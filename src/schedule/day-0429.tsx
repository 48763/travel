import type { Day } from '../types';

const day: Day = {
  date: '2026-04-29',
  events: [
    {
      type: 'shopping',
      time: '14:00',
      title: '[測試] 昨天的採買',
      details: '應該整筆呈現淡化（過去日期）',
      address: '台北市信義區信義路五段7號',
    },
    {
      type: 'food',
      time: '19:00',
      title: '[測試] 昨天的晚餐',
      details: '驗證 past 樣式：opacity 0.5',
    },
  ],
};

export default day;
