
import { FaUserFriends, FaCalendarAlt } from 'react-icons/fa';
import type { Day } from '../types';

const day: Day = {
  date: '06/02 (二)',
  events: [
    {
      time: '全天',
      title: '彈性行程日',
      details: '本日為彈性時間，可自由安排。',
      icon: <FaCalendarAlt />,
      iconColor: '#34495e'
    },
    {
      time: '下午',
      title: '與布來燈碰面',
      details: '計畫會面地點與時間。',
      icon: <FaUserFriends />,
      iconColor: '#9b59b6'
    }
  ]
};

export default day;
