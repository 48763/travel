import { defineTrip } from '../../trip';

export default defineTrip(
  {
    id: 'japan-2026-spring',
    title: '日本 2026 春季 (範例)',
    year: 2026,
    startMonth: 3,
    accent: '#ec7180',
  },
  (d) => [
    {
      date: d(3, 21),
      events: [
        {
          type: 'planeDeparture',
          time: '09:00',
          title: '前往京都',
          address: '台北松山機場 (TSA)',
        },
        {
          type: 'hotel',
          time: '16:00',
          title: '入住京都飯店',
          address: '京都市下京区',
        },
      ],
    },
    {
      date: d(3, 22),
      events: [
        {
          type: 'walking',
          time: '09:00',
          title: '嵐山竹林散策',
          address: '京都市右京区嵯峨小倉山',
        },
        {
          type: 'food',
          time: '13:00',
          title: '午餐',
        },
        {
          type: 'activity',
          time: '15:00',
          title: '渡月橋賞櫻',
          address: '京都市右京区嵯峨中ノ島町',
        },
      ],
    },
    {
      date: d(3, 23),
      events: [
        {
          type: 'walking',
          time: '10:00',
          title: '清水寺',
          address: '京都市東山区清水1丁目294',
        },
        {
          type: 'shopping',
          time: '14:00',
          title: '錦市場',
          address: '京都市中京区富小路通四条上る西大文字町',
        },
        {
          type: 'food',
          time: '19:00',
          title: '河原町晚餐',
        },
      ],
    },
    {
      date: d(3, 24),
      events: [
        {
          type: 'planeArrival',
          time: '18:00',
          title: '返回台北',
          address: '関西国際空港',
        },
      ],
    },
  ],
);
