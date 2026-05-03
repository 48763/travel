import { FaChevronLeft, FaArrowLeft } from 'react-icons/fa';
import { trips } from './trips';
import type { TripDefinition } from './trip';
import { formatDate } from './dateUtils';
import { TripSelector } from './TripSelector';

type SidebarProps = {
  trip: TripDefinition;
  isOpen: boolean;
  closeSidebar: () => void;
  closeOnMobile: () => void;
  todayIndex: number | null;
  onTripChange: (id: string) => void;
};

export const Sidebar = ({
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
      <TripSelector
        trip={trip}
        onTripChange={(id) => {
          onTripChange(id);
          closeOnMobile();
        }}
      />
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
