import type { ReactNode } from 'react';
import {
  FaPlaneDeparture, FaPlaneArrival, FaTrain, FaCalendarAlt,
  FaHotel, FaUtensils, FaShoppingBag, FaGamepad, FaWalking,
  FaSuitcase, FaUserFriends, FaQuestionCircle,
} from 'react-icons/fa';
import type { EventType } from './types';

export const EVENT_STYLE: Record<EventType, { icon: ReactNode; color: string }> = {
  planeDeparture: { icon: <FaPlaneDeparture />, color: '#094a9d' },
  planeArrival:   { icon: <FaPlaneArrival />,   color: '#2a8deb' },
  train:          { icon: <FaTrain />,          color: '#34495e' },
  schedule:       { icon: <FaCalendarAlt />,    color: '#34495e' },
  hotel:          { icon: <FaHotel />,          color: '#8e44ad' },
  food:           { icon: <FaUtensils />,       color: '#e67e22' },
  shopping:       { icon: <FaShoppingBag />,    color: '#27ae60' },
  activity:       { icon: <FaGamepad />,        color: '#2ecc71' },
  walking:        { icon: <FaWalking />,        color: '#2ecc71' },
  luggage:        { icon: <FaSuitcase />,       color: '#7f8c8d' },
  social:         { icon: <FaUserFriends />,    color: '#9b59b6' },
  unknown:        { icon: <FaQuestionCircle />, color: '#95a5a6' },
};
