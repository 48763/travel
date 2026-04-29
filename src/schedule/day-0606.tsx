
import { FaSuitcase, FaWalking } from 'react-icons/fa';
import type { Day } from '../types';
import { ICON_COLORS } from '../colors';

const day: Day = {
  date: '06/06 (六)',
  events: [
    {
      time: '10:00',
      title: '退房手續',
      details: '最晚退房時間 11:00',
      icon: <FaSuitcase />,
      iconColor: ICON_COLORS.luggage
    },
    {
      time: '全天',
      title: '休閒行程',
      details: '本日為休閒時間，輕鬆探索。',
      icon: <FaWalking />,
      iconColor: ICON_COLORS.activity
    }
  ]
};

export default day;
