import { useEffect, useState, type CSSProperties } from 'react';
import { FaTimes } from 'react-icons/fa';
import { tripsByCategory, labelOfCategory } from './trips';
import type { TripDefinition } from './trip';
import { TripMap } from './TripMap';

export type TripStatus = 'past' | 'ongoing' | 'upcoming' | 'planned' | 'sample';

const STATUS_LABEL: Record<TripStatus, string> = {
  past: '已完成',
  ongoing: '進行中',
  upcoming: '即將出發',
  planned: '計畫中',
  sample: '範例',
};

function tripDateRange(trip: TripDefinition): { first: string; last: string } | null {
  if (trip.schedule.length === 0) return null;
  const dates = trip.schedule.map((d) => d.date).slice().sort();
  return { first: dates[0], last: dates[dates.length - 1] };
}

function tripStatus(trip: TripDefinition, category: string, today: string): TripStatus {
  if (category === 'samples') return 'sample';
  const range = tripDateRange(trip);
  if (!range) return 'planned';
  if (today < range.first) return 'upcoming';
  if (today > range.last) return 'past';
  return 'ongoing';
}

function formatShort(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${m}.${d}`;
}

function dayCount(first: string, last: string): number {
  const a = new Date(`${first}T00:00:00`).getTime();
  const b = new Date(`${last}T00:00:00`).getTime();
  return Math.round((b - a) / 86400000) + 1;
}

function fullLocationText(trip: TripDefinition): string {
  return (trip.locations ?? [])
    .map((l) => l.label)
    .filter(Boolean)
    .join(' → ');
}

type TripCardProps = {
  trip: TripDefinition;
  status: TripStatus;
  isHighlighted: boolean;
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onEnter: () => void;
  onHover: () => void;
  onLeave: () => void;
};

const TripCard = ({
  trip, status, isHighlighted, isExpanded,
  onExpand, onCollapse, onEnter, onHover, onLeave,
}: TripCardProps) => {
  const range = tripDateRange(trip);
  const accentStyle = { '--card-accent': trip.accent } as CSSProperties;
  const locText = fullLocationText(trip);

  if (isExpanded) {
    return (
      <article
        className={`trip-card trip-card--${status} is-expanded`}
        style={accentStyle}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <span className="trip-card__rail" aria-hidden="true" />
        <button
          type="button"
          className="trip-card__close"
          onClick={onCollapse}
          aria-label="收起"
        >
          <FaTimes />
        </button>
        <div className="trip-card__body">
          <div className="trip-card__heading">
            <h3 className="trip-card__title trip-card__title--expanded">{trip.title}</h3>
            <span className={`trip-card__badge trip-card__badge--${status}`}>
              {STATUS_LABEL[status]}
            </span>
          </div>
          <div className="trip-card__meta">
            {range && (
              <span className="trip-card__range">
                {formatShort(range.first)} – {formatShort(range.last)}
              </span>
            )}
            {range && (
              <span className="trip-card__days">
                {dayCount(range.first, range.last)} 天
              </span>
            )}
            <span className="trip-card__events">
              {trip.schedule.reduce((n, d) => n + d.events.length, 0)} 個 events
            </span>
          </div>
          {locText && (
            <div className="trip-card__location-full">
              📍 {locText}
            </div>
          )}
          <div className="trip-card__actions">
            <button
              type="button"
              className="trip-card__enter"
              onClick={onEnter}
            >
              進入行程 →
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <button
      type="button"
      className={`trip-card trip-card--${status} ${isHighlighted ? 'is-highlighted' : ''}`}
      style={accentStyle}
      onClick={onExpand}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <span className="trip-card__rail" aria-hidden="true" />
      <div className="trip-card__body">
        <div className="trip-card__heading">
          <h3 className="trip-card__title" title={trip.title}>{trip.title}</h3>
          <span className={`trip-card__badge trip-card__badge--${status}`}>
            {STATUS_LABEL[status]}
          </span>
        </div>
        <div className="trip-card__meta">
          {range && (
            <span className="trip-card__range">
              {formatShort(range.first)} – {formatShort(range.last)}
            </span>
          )}
          {range && (
            <span className="trip-card__days">
              {dayCount(range.first, range.last)} 天
            </span>
          )}
          {locText && (
            <span className="trip-card__location" title={locText}>
              📍 {locText}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

type TripIndexProps = {
  today: string;
  onSelect: (id: string) => void;
};

export const TripIndex = ({ today, onSelect }: TripIndexProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const totalTrips = tripsByCategory.reduce((n, [, list]) => n + list.length, 0);

  useEffect(() => {
    if (!expandedId) return;
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.trip-card.is-expanded')) {
        setExpandedId(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedId(null);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [expandedId]);

  return (
    <div className="trip-index">
      <header className="trip-index__hero">
        <h1 className="trip-index__title">歷年旅行</h1>
        <p className="trip-index__subtitle">{totalTrips} 趟旅行</p>
      </header>

      <TripMap
        hoveredId={hoveredId}
        onHover={setHoveredId}
        onSelect={onSelect}
      />

      {tripsByCategory.map(([category, entries]) => (
        <section key={category} className="trip-index__section">
          <h2 className="trip-index__section-title">{labelOfCategory(category)}</h2>
          <div className="trip-index__cards">
            {entries.map(({ trip }) => (
              <TripCard
                key={trip.id}
                trip={trip}
                status={tripStatus(trip, category, today)}
                isHighlighted={hoveredId === trip.id}
                isExpanded={expandedId === trip.id}
                onExpand={() => setExpandedId(trip.id)}
                onCollapse={() => setExpandedId(null)}
                onEnter={() => onSelect(trip.id)}
                onHover={() => setHoveredId(trip.id)}
                onLeave={() => setHoveredId(null)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
