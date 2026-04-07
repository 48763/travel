
import { FaUtensils, FaSuitcase, FaGamepad, FaHotel } from 'react-icons/fa';

export const day0529 = {
  date: '05/29 (五)',
  events: [
    {
      time: '06:00',
      title: '早餐時間',
      details: '最晚用餐時間 10:00',
      icon: <FaUtensils />,
      iconColor: '#e67e22'
    },
    {
      time: '10:00',
      title: '退房手續',
      details: '最晚退房時間 11:00\n寄存行李',
      icon: <FaSuitcase />,
      iconColor: '#7f8c8d'
    },
    {
      time: '10:00',
      title: 'Pokémon GO Fest 公園遊記',
      details: '本次旅程的主要活動內容。',
      address: '東京都千代田区日比谷公園',
      icon: <FaGamepad />,
      iconColor: '#2ecc71'
    },
    {
      time: '22:00',
      title: '入住 濱松町京王布萊索飯店',
      details: 'Keio Presso Inn Hamamatsucho',
      address: '東京都港区浜松町1丁目18-11',
      icon: <FaHotel />,
      iconColor: '#8e44ad'
    }
  ]
};
