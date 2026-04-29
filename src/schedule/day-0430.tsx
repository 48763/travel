import type { Day } from '../types';

const day: Day = {
  date: '2026-04-30',
  events: [
    {
      type: 'planeDeparture',
      time: '08:30',
      title: '[測試] 今天出發',
      details: '驗證進站時應自動捲到這一節',
      address: '台北松山機場',
    },
    {
      type: 'train',
      time: '12:00',
      title: '[測試] 今天的轉乘',
      details: '驗證 train 類型 icon 與顏色',
      address: '東京駅',
    },
    {
      type: 'hotel',
      time: '15:00',
      title: '[測試] 今天的入住',
      details: '驗證 hotel 類型 + 多點路線（≥ 2 個地址才會出現「路線」按鈕）',
      address: '東京都江東区有明2丁目1-5',
    },
    {
      type: 'food',
      time: '19:30',
      title: '[測試] 今晚晚餐',
      details: '驗證 today 的 sidebar 標記與日期欄今日 badge',
    },
  ],
};

export default day;
