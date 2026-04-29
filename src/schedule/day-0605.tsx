
import { FaQuestionCircle } from 'react-icons/fa';
import type { Day } from '../types';
import { ICON_COLORS } from '../colors';

const day: Day = {
  date: '06/05 (五)',
  events: [
    {
      time: '未定',
      title: '未定行程',
      details: '請在此填寫您的計畫...',
      icon: <FaQuestionCircle />,
      iconColor: ICON_COLORS.unknown
    }
  ]
};

export default day;
