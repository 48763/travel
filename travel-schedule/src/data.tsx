import React from 'react';
import { FaPlaneDeparture, FaPlaneArrival, FaMapMarkerAlt, FaSuitcaseRolling, FaGamepad, FaBriefcase, FaQuestionCircle } from 'react-icons/fa';

export const schedule = [
  {
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
  },
  {
    date: '05/29 (五)',
    events: [
      {
        time: '全天',
        title: '主要活動日',
        details: '本日為行程重點，請填寫詳細計畫。',
        icon: <FaMapMarkerAlt />,
        iconColor: '#e74c3c'
      }
    ]
  },
  {
    date: '05/30 (六)',
    events: [
      {
        time: '全天',
        title: '城市散步 & Pokémon Go',
        details: '可彈性調整，或考慮下午處理工作。',
        icon: <FaGamepad />,
        iconColor: '#2ecc71'
      }
    ]
  },
  {
    date: '05/31 (日)',
    events: [
      {
        time: '全天',
        title: '城市散步 & Pokémon Go',
        details: '探索城市的其他區域。',
        icon: <FaGamepad />,
        iconColor: '#2ecc71'
      }
    ]
  },
  {
    date: '06/01 (一)',
    events: [
      {
        time: '全天',
        title: '彈性日 / 工作安排',
        details: '可以安排處理工作事務，或安排短程觀光。',
        icon: <FaBriefcase />,
        iconColor: '#f39c12'
      }
    ]
  },
  {
    date: '06/02 (二)',
    events: [
      {
        time: '下午',
        title: '更換飯店 & 會面',
        details: '與「布來燈」碰面。',
        icon: <FaSuitcaseRolling />,
        iconColor: '#9b59b6'
      }
    ]
  },
  {
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
  },
  {
    date: '06/04 (四)',
    events: [
      {
        time: '未定',
        title: '未定行程',
        details: '請在此填寫您的計畫...',
        icon: <FaQuestionCircle />,
        iconColor: '#95a5a6'
      }
    ]
  },
  {
    date: '06/05 (五)',
    events: [
      {
        time: '未定',
        title: '未定行程',
        details: '請在此填寫您的計畫...',
        icon: <FaQuestionCircle />,
        iconColor: '#95a5a6'
      }
    ]
  },
  {
    date: '06/06 (六)',
    events: [
      {
        time: '未定',
        title: '未定行程',
        details: '請在此填寫您的計畫...',
        icon: <FaQuestionCircle />,
        iconColor: '#95a5a6'
      }
    ]
  },
  {
    date: '06/07 (日)',
    events: [
      {
        time: '09:40',
        title: '起飛：返回台灣',
        details: '全日空 NH851\n東京羽田 (HND)',
        icon: <FaPlaneDeparture />,
        iconColor: '#094a9d'
      },
      {
        time: '12:05',
        title: '抵達台灣',
        details: '台北松山 (TSA)',
        icon: <FaPlaneArrival />,
        iconColor: '#2a8deb'
      }
    ]
  },
];
