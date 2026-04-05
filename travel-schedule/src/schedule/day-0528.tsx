import React from 'react';
import { FaPlaneDeparture, FaPlaneArrival, FaHotel, FaUtensils, FaShoppingBag } from 'react-icons/fa';

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
    },
    {
      time: '15:00',
      title: '入住 維拉芳泉東京有明大飯店',
      details: 'Villa Fontaine Grand Tokyo Ariake',
      icon: <FaHotel />,
      iconColor: '#8e44ad'
    },
    {
      time: '17:00',
      title: '晚餐時間',
      details: '最晚點餐時間 21:30\n最晚用餐時間 22:00',
      icon: <FaUtensils />,
      iconColor: '#e67e22'
    },
    {
      time: '19:30',
      title: '有明花園購物中心',
      details: '步行約 5 分鐘',
      icon: <FaShoppingBag />,
      iconColor: '#27ae60'
    }
  ]
};
