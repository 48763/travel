import React from 'react';
import { FaPlaneDeparture, FaPlaneArrival } from 'react-icons/fa';

export const day0607 = {
  date: '06/07 (日)',
  events: [
    {
      time: '09:40',
      title: '起飛：返回台灣',
      details: '全日空 NH851\n東京羽田 (HND)',
      address: '羽田機場 (HND)',
      icon: <FaPlaneDeparture />,
      iconColor: '#094a9d'
    },
    {
      time: '12:05',
      title: '抵達台灣',
      details: '台北松山 (TSA)',
      address: '台北松山機場 (TSA)',
      icon: <FaPlaneArrival />,
      iconColor: '#2a8deb'
    }
  ]
};
