import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { trips, tripEntries, tripsByCategory, labelOfCategory } from './trips';
import type { TripDefinition } from './trip';
import { TripIndex } from './TripIndex';
import './App.css';
import {
  FaBars, FaChevronLeft, FaChevronDown, FaMapMarkerAlt,
  FaArrowUp, FaArrowDown, FaRoute, FaArrowLeft,
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

function readTripIdFromHash(): string {
  return window.location.hash.replace(/^#\/?/, '');
}

function resolveTrip(): TripDefinition | null {
  const id = readTripIdFromHash();
  if (!id) return null;
  return trips.find((t) => t.id === id) ?? null;
}

type TripSelectorProps = {
  trip: TripDefinition;
  onTripChange: (id: string) => void;
};

const TripSelector = ({ trip, onTripChange }: TripSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const handleTrigger = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    const cat = tripEntries.find((e) => e.trip.id === trip.id)?.category ?? null;
    setActiveCategory(cat);
    setIsOpen(true);
  };

  const handleSelect = (id: string) => {
    onTripChange(id);
    setIsOpen(false);
  };

  return (
    <div className="trip-selector" ref={ref}>
      <button
        type="button"
        className="trip-selector__trigger"
        onClick={handleTrigger}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="trip-selector__current">{trip.title}</span>
        <FaChevronDown
          className={`trip-selector__caret ${isOpen ? 'is-open' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="trip-selector__menu" role="menu">
          {tripsByCategory.map(([category, entries]) => {
            const isActive = activeCategory === category;
            return (
              <div key={category} className="trip-selector__group">
                <button
                  type="button"
                  className={`trip-selector__category ${isActive ? 'is-active' : ''}`}
                  onMouseEnter={() => setActiveCategory(category)}
                  onClick={() => setActiveCategory(isActive ? null : category)}
                  aria-expanded={isActive}
                >
                  <span>{labelOfCategory(category)}</span>
                  <FaChevronDown
                    className={`trip-selector__caret trip-selector__caret--small ${isActive ? 'is-open' : ''}`}
                  />
                </button>
                {isActive && (
                  <ul className="trip-selector__submenu">
                    {entries.map(({ trip: t }) => (
                      <li key={t.id}>
                        <button
                          type="button"
                          className={`trip-selector__option ${t.id === trip.id ? 'is-current' : ''}`}
                          onClick={() => handleSelect(t.id)}
                          role="menuitem"
                        >
                          {t.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

type SidebarProps = {
  trip: TripDefinition;
  isOpen: boolean;
  closeSidebar: () => void;
  closeOnMobile: () => void;
  todayIndex: number | null;
  onTripChange: (id: string) => void;
};

const Sidebar = ({
  trip, isOpen, closeSidebar, closeOnMobile, todayIndex, onTripChange,
}: SidebarProps) => (
  <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
    <div className="sidebar-header">
      <h2 className="sidebar-title">行程目錄</h2>
      <button className="toggle-btn" onClick={closeSidebar} aria-label="關閉側邊欄">
        <FaChevronLeft />
      </button>
    </div>
    <a href="#/" className="sidebar-home-link" onClick={closeOnMobile}>
      <FaArrowLeft />
      <span>歷年旅行</span>
    </a>
    {trips.length > 1 && (
      <TripSelector trip={trip} onTripChange={onTripChange} />
    )}
    <nav>
      <ul className="sidebar-nav">
        {trip.schedule.map((day, idx) => {
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

        {event.details && (
          <p className="event-details">
            {Array.isArray(event.details) ? event.details.join('\n') : event.details}
          </p>
        )}
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
  const today = todayISO();
  const [trip, setTrip] = useState<TripDefinition | null>(() => resolveTrip());
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => !window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const handler = () => setTrip(resolveTrip());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  useEffect(() => {
    document.title = trip ? trip.title : '歷年旅行';
  }, [trip]);

  const todayIndex = (() => {
    if (!trip) return null;
    const idx = trip.schedule.findIndex((d) => d.date === today);
    return idx === -1 ? null : idx;
  })();

  useEffect(() => {
    if (todayIndex === null) return;
    const el = document.getElementById(`day-${todayIndex}`);
    if (el) el.scrollIntoView({ block: 'start' });
  }, [todayIndex, trip?.id]);

  if (!trip) {
    return (
      <TripIndex
        today={today}
        onSelect={(id) => { window.location.hash = `#/${id}`; }}
      />
    );
  }

  const closeSidebar = () => setIsSidebarOpen(false);
  const closeOnMobile = () => {
    if (window.matchMedia(MOBILE_QUERY).matches) {
      setIsSidebarOpen(false);
    }
  };

  const onTripChange = (id: string) => {
    window.location.hash = `#/${id}`;
  };

  const accentStyle = { '--accent': trip.accent } as CSSProperties;

  return (
    <div className="app-layout" style={accentStyle}>
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
        trip={trip}
        isOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
        closeOnMobile={closeOnMobile}
        todayIndex={todayIndex}
        onTripChange={onTripChange}
      />
      <main className="main-content-wrapper">
        <div className="app-container">
          <h1 className="main-title">{trip.title}</h1>
          <div className="schedule-list">
            {trip.schedule.map((day, index) => (
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
