import type { Day } from '../types';

const day: Day = {
  date: '2026-06-07',
  events: [
    {
      time: '09:40',
      title: '起飛：返回台灣',
      details: '全日空 NH851\n東京羽田 (HND)',
      address: '羽田機場 (HND)',
      type: 'planeDeparture'
    },
    {
      time: '12:05',
      title: '抵達台灣',
      details: '台北松山 (TSA)',
      address: '台北松山機場 (TSA)',
      type: 'planeArrival'
    }
  ]
};

export default day;
