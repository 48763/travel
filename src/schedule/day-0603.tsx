
import { FaQuestionCircle } from 'react-icons/fa';
import type { Day } from '../types';

const day: Day = {
  date: '06/03 (三)',
  events: [
    {
      time: '未定',
      title: '未定行程',
      details: '請在此填寫您的計畫...',
      icon: <FaQuestionCircle />,
      iconColor: '#95a5a6'
    }
  ]
};

export default day;
