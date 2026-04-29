
import { FaCalendarAlt } from 'react-icons/fa';
import type { Day } from '../types';
import { ICON_COLORS } from '../colors';

const day: Day = {
  date: '05/30 (六)',
  events: [
    {
      time: '全天',
      title: '彈性行程日',
      details: '本日為彈性時間，可自由安排。',
      icon: <FaCalendarAlt />,
      iconColor: ICON_COLORS.schedule
    }
  ]
};

export default day;
