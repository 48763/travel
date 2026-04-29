
import { FaGamepad } from 'react-icons/fa';
import type { Day } from '../types';
import { ICON_COLORS } from '../colors';

const day: Day = {
  date: '05/31 (日)',
  events: [
    {
      time: '全天',
      title: '城市散步 & Pokémon Go',
      details: '探索城市的其他區域。',
      icon: <FaGamepad />,
      iconColor: ICON_COLORS.activity
    }
  ]
};

export default day;
