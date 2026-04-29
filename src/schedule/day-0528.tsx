import type { Day } from '../types';

const day: Day = {
  date: '2026-05-28',
  events: [
    {
      time: '07:20',
      title: '啟程飛往日本',
      details: '長榮航空 BR192\n台北松山 (TSA)',
      address: '台北松山機場 (TSA)',
      type: 'planeDeparture'
    },
    {
      time: '11:30',
      title: '抵達日本',
      details: '東京羽田 (HND)',
      address: '羽田機場 (HND)',
      type: 'planeArrival'
    },
    {
      time: '13:00',
      title: '前往 維拉芳泉東京有明大飯店',
      lines: [
        { 
          name: 'KK', 
          color: '#e60012', 
          description: '京急線, 往品川, 羽田機場第3航廈 -> 大井町, 約 20 分鐘' 
        },
        { 
          name: 'R', 
          color: '#00a0e2', 
          description: '臨海線, 往新木場, 大井町 -> 有明網球之森, 約 10 分鐘' 
        }
      ],
      type: 'train'
    },
    {
      time: '15:00',
      title: '入住 維拉芳泉東京有明大飯店',
      details: 'Villa Fontaine Grand Tokyo Ariake',
      address: '東京都江東区有明2丁目1-5',
      type: 'hotel'
    },
    {
      time: '17:00',
      title: '晚餐時間',
      details: '最晚點餐時間 21:30\n最晚用餐時間 22:00',
      type: 'food'
    },
    {
      time: '19:30',
      title: '有明花園購物中心',
      details: '步行約 5 分鐘',
      address: '東京都江東区有明2丁目1-8',
      type: 'shopping'
    }
  ]
};

export default day;
