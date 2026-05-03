import { FaMapMarkerAlt } from 'react-icons/fa';
import type { Event } from './types';
import { EVENT_STYLE } from './eventStyle';

type EventCardProps = {
  event: Event;
  id?: string;
};

export const EventCard = ({ event, id }: EventCardProps) => {
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
