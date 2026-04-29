
import { FaPlaneDeparture, FaPlaneArrival } from 'react-icons/fa';
import type { Day } from '../types';
import { ICON_COLORS } from '../colors';

const day: Day = {
  date: '06/07 (日)',
  events: [
    {
      time: '09:40',
      title: '起飛：返回台灣',
      details: '全日空 NH851\n東京羽田 (HND)',
      address: '羽田機場 (HND)',
      icon: <FaPlaneDeparture />,
      iconColor: ICON_COLORS.planeDeparture
    },
    {
      time: '12:05',
      title: '抵達台灣',
      details: '台北松山 (TSA)',
      address: '台北松山機場 (TSA)',
      icon: <FaPlaneArrival />,
      iconColor: ICON_COLORS.planeArrival
    }
  ]
};

export default day;
