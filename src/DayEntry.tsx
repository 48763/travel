import { FaRoute } from 'react-icons/fa';
import type { Day, Event } from './types';
import { formatDate, type DayStatus } from './dateUtils';
import { EventCard } from './EventCard';

function dayMapUrl(events: Event[]): string | null {
  const stops = events
    .filter((e) => e.address)
    .map((e) => encodeURIComponent(e.address!));
  if (stops.length < 2) return null;
  return `https://www.google.com/maps/dir/${stops.join('/')}`;
}

type DayEntryProps = {
  day: Day;
  index: number;
  status: DayStatus;
};

export const DayEntry = ({ day, index, status }: DayEntryProps) => {
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
