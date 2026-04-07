import React, { useState } from 'react';
import { schedule } from './data.tsx';
import './App.css';
import { FaBars, FaChevronLeft, FaMapMarkerAlt } from 'react-icons/fa';

const Sidebar = ({ schedule, isOpen, toggleSidebar }: { schedule: any[], isOpen: boolean, toggleSidebar: () => void }) => (
  <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
    <div className="sidebar-header">
      <h2 className="sidebar-title">行程目錄</h2>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FaChevronLeft />
      </button>
    </div>
    <ul className="sidebar-nav">
      {schedule.map((day, idx) => (
        <li key={idx} className="sidebar-day">
          <a href={`#day-${idx}`} className="sidebar-day-link">{day.date}</a>
          <ul className="sidebar-events">
            {day.events.map((ev: any, evIdx: number) => (
              <li key={evIdx} className="sidebar-event">
                <a href={`#event-${idx}-${evIdx}`} className="sidebar-event-link">
                  {ev.title}
                </a>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </div>
);

const EventCard = ({ event, id }: { event: any, id?: string }) => (
  <div className="event-card" id={id}>
    <div className="event-icon" style={{ color: event.iconColor }}>
      {event.icon}
    </div>
    <div className="event-content">
      <div className="event-header">
        {event.time && <span className="event-time" style={{ color: event.iconColor }}>{event.time}</span>}
        <span className="event-title">{event.title}</span>
      </div>
      
      {event.address && (
        <div className="event-address">
          <FaMapMarkerAlt className="address-icon" />
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="address-link"
          >
            {event.address}
          </a>
        </div>
      )}

      {event.lines && (
        <div className="event-lines-list">
          {event.lines.map((line: any, lIdx: number) => (
            <div key={lIdx} className="line-item">
              <span 
                className="line-badge" 
                style={{ backgroundColor: line.color, color: line.textColor || '#fff' }}
              >
                {line.name}
              </span>
              <span className="line-description-text">{line.description}</span>
            </div>
          ))}
        </div>
      )}

      {event.details && <p className="event-details">{event.details}</p>}
    </div>
  </div>
);

const DayEntry = ({ day, index }: { day: any, index: number }) => (
  <div className="day-entry" id={`day-${index}`}>
    <div className="date-column">{day.date}</div>
    <div className="events-column">
      {day.events.map((ev: any, idx: number) => (
        <EventCard key={idx} event={ev} id={`event-${index}-${idx}`} />
      ))}
    </div>
  </div>
);

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="app-layout">
      {!isSidebarOpen && (
        <button className="open-sidebar-btn" onClick={() => setIsSidebarOpen(true)}>
          <FaBars />
        </button>
      )}
      <Sidebar schedule={schedule} isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
      <div className="main-content-wrapper">
        <div className="app-container">
          <h1 className="main-title">日本旅遊時程</h1>
          <div className="schedule-list">
            {schedule.map((day, index) => (
              <DayEntry key={index} day={day} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
