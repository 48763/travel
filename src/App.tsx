import { useEffect, useState } from 'react';
import { schedule } from './data.tsx';
import './App.css';
import {
  FaBars, FaChevronLeft, FaMapMarkerAlt,
  FaArrowUp, FaArrowDown, FaRoute,
} from 'react-icons/fa';
import type { Day, Event } from './types';
import { EVENT_STYLE } from './eventStyle';

const MOBILE_QUERY = '(max-width: 768px)';
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${m}/${dd} (${WEEKDAYS[d.getDay()]})`;
}

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

type DayStatus = 'past' | 'today' | 'future';

function dayStatus(iso: string, today: string): DayStatus {
  if (iso < today) return 'past';
  if (iso === today) return 'today';
  return 'future';
}

function dayMapUrl(events: Event[]): string | null {
  const stops = events
    .filter(e => e.address)
    .map(e => encodeURIComponent(e.address!));
  if (stops.length < 2) return null;
  return `https://www.google.com/maps/dir/${stops.join('/')}`;
}

type SidebarProps = {
  schedule: Day[];
  isOpen: boolean;
  closeSidebar: () => void;
  closeOnMobile: () => void;
  todayIndex: number | null;
};

const Sidebar = ({ schedule, isOpen, closeSidebar, closeOnMobile, todayIndex }: SidebarProps) => (
  <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
    <div className="sidebar-header">
      <h2 className="sidebar-title">行程目錄</h2>
      <button className="toggle-btn" onClick={closeSidebar} aria-label="關閉側邊欄">
        <FaChevronLeft />
      </button>
    </div>
    <nav>
      <ul className="sidebar-nav">
        {schedule.map((day, idx) => {
          const isToday = idx === todayIndex;
          return (
            <li
              key={day.date}
              className={`sidebar-day ${isToday ? 'sidebar-day--today' : ''}`}
            >
              <a href={`#day-${idx}`} className="sidebar-day-link" onClick={closeOnMobile}>
                {isToday && <span className="today-badge">今日</span>}
                {formatDate(day.date)}
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
          );
        })}
      </ul>
    </nav>
  </aside>
);

const EventCard = ({ event, id }: { event: Event, id?: string }) => {
  const { icon, color } = EVENT_STYLE[event.type];
  return (
    <article className="event-card" id={id}>
      <div className="event-icon" style={{ color }}>
        {icon}
      </div>
      <div className="event-content">
        <div className="event-header">
          {event.time && <span className="event-time" style={{ color }}>{event.time}</span>}
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
};

type DayEntryProps = { day: Day; index: number; status: DayStatus };

const DayEntry = ({ day, index, status }: DayEntryProps) => {
  const labelId = `day-${index}-label`;
  const mapUrl = dayMapUrl(day.events);
  return (
    <section
      className={`day-entry day-entry--${status}`}
      id={`day-${index}`}
      aria-labelledby={labelId}
    >
      <div className="date-column">
        <span id={labelId} className="date-text">{formatDate(day.date)}</span>
        {status === 'today' && <span className="date-today-tag">今日</span>}
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="day-map-link"
          >
            <FaRoute /> 路線
          </a>
        )}
      </div>
      <div className="events-column">
        {day.events.map((ev, idx) => (
          <EventCard key={idx} event={ev} id={`event-${index}-${idx}`} />
        ))}
      </div>
    </section>
  );
};

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

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => !window.matchMedia(MOBILE_QUERY).matches
  );

  const today = todayISO();
  const todayIndex = (() => {
    const idx = schedule.findIndex(d => d.date === today);
    return idx === -1 ? null : idx;
  })();

  useEffect(() => {
    if (todayIndex === null) return;
    const el = document.getElementById(`day-${todayIndex}`);
    if (el) el.scrollIntoView({ block: 'start' });
  }, [todayIndex]);

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
        todayIndex={todayIndex}
      />
      <main className="main-content-wrapper">
        <div className="app-container">
          <h1 className="main-title">日本旅遊時程</h1>
          <div className="schedule-list">
            {schedule.map((day, index) => (
              <DayEntry
                key={day.date}
                day={day}
                index={index}
                status={dayStatus(day.date, today)}
              />
            ))}
          </div>
        </div>
      </main>
      <ScrollControls />
    </div>
  );
}

export default App;
