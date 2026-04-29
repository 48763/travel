import { useState } from 'react';
import { schedule } from './data.tsx';
import './App.css';
import { FaBars, FaChevronLeft, FaMapMarkerAlt, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import type { Day, Event } from './types';

const MOBILE_QUERY = '(max-width: 768px)';

type SidebarProps = {
  schedule: Day[];
  isOpen: boolean;
  closeSidebar: () => void;
  closeOnMobile: () => void;
};

const Sidebar = ({ schedule, isOpen, closeSidebar, closeOnMobile }: SidebarProps) => (
  <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
    <div className="sidebar-header">
      <h2 className="sidebar-title">行程目錄</h2>
      <button className="toggle-btn" onClick={closeSidebar} aria-label="關閉側邊欄">
        <FaChevronLeft />
      </button>
    </div>
    <nav>
      <ul className="sidebar-nav">
        {schedule.map((day, idx) => (
          <li key={idx} className="sidebar-day">
            <a href={`#day-${idx}`} className="sidebar-day-link" onClick={closeOnMobile}>
              {day.date}
            </a>
            <ul className="sidebar-events">
              {day.events.map((ev, evIdx) => (
                <li key={evIdx} className="sidebar-event">
                  <a
                    href={`#event-${idx}-${evIdx}`}
                    className="sidebar-event-link"
                    onClick={closeOnMobile}
                  >
                    {ev.title}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

const EventCard = ({ event, id }: { event: Event, id?: string }) => (
  <article className="event-card" id={id}>
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
          {event.lines.map((line, lIdx) => (
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
  </article>
);

const ScrollControls = () => {
  const scrollTo = (top: number) => window.scrollTo({ top, behavior: 'smooth' });
  return (
    <div className="scroll-controls">
      <button
        type="button"
        className="scroll-btn"
        onClick={() => scrollTo(0)}
        aria-label="回到頂端"
      >
        <FaArrowUp />
      </button>
      <button
        type="button"
        className="scroll-btn"
        onClick={() => scrollTo(document.documentElement.scrollHeight)}
        aria-label="移到最底"
      >
        <FaArrowDown />
      </button>
    </div>
  );
};

const DayEntry = ({ day, index }: { day: Day, index: number }) => {
  const labelId = `day-${index}-label`;
  return (
    <section className="day-entry" id={`day-${index}`} aria-labelledby={labelId}>
      <div className="date-column" id={labelId}>{day.date}</div>
      <div className="events-column">
        {day.events.map((ev, idx) => (
          <EventCard key={idx} event={ev} id={`event-${index}-${idx}`} />
        ))}
      </div>
    </section>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => !window.matchMedia(MOBILE_QUERY).matches
  );

  const closeSidebar = () => setIsSidebarOpen(false);
  const closeOnMobile = () => {
    if (window.matchMedia(MOBILE_QUERY).matches) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="app-layout">
      {!isSidebarOpen && (
        <button
          className="open-sidebar-btn"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="開啟側邊欄"
        >
          <FaBars />
        </button>
      )}
      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      <Sidebar
        schedule={schedule}
        isOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
        closeOnMobile={closeOnMobile}
      />
      <main className="main-content-wrapper">
        <div className="app-container">
          <h1 className="main-title">日本旅遊時程</h1>
          <div className="schedule-list">
            {schedule.map((day, index) => (
              <DayEntry key={index} day={day} index={index} />
            ))}
          </div>
        </div>
      </main>
      <ScrollControls />
    </div>
  );
}

export default App;
