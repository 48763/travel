import { useEffect, useState, type CSSProperties } from 'react';
import { FaBars } from 'react-icons/fa';
import { trips } from './trips';
import type { TripDefinition } from './trip';
import { TripIndex } from './TripIndex';
import { Sidebar } from './Sidebar';
import { DayEntry } from './DayEntry';
import { ScrollControls } from './ScrollControls';
import { todayISO, dayStatus } from './dateUtils';
import { MOBILE_QUERY } from './constants';
import './App.css';

function readTripIdFromHash(): string {
  return window.location.hash.replace(/^#\/?/, '');
}

function resolveTrip(): TripDefinition | null {
  const id = readTripIdFromHash();
  if (!id) return null;
  return trips.find((t) => t.id === id) ?? null;
}

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
