import React from 'react';
import { FaPlaneDeparture, FaPlaneArrival } from 'react-icons/fa';

export const day0528 = {
  date: '05/28 (四)',
  events: [
    {
      time: '07:20',
      title: '啟程飛往日本',
      details: '長榮航空 BR192\n台北松山 (TSA)',
      icon: <FaPlaneDeparture />,
      iconColor: '#094a9d'
    },
    {
      time: '11:30',
      title: '抵達日本',
      details: '東京羽田 (HND)',
      icon: <FaPlaneArrival />,
      iconColor: '#2a8deb'
    }
  ]
};
