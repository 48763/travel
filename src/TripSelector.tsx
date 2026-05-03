import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { tripEntries, tripsByCategory, labelOfCategory } from './trips';
import type { TripDefinition } from './trip';
import { MOBILE_QUERY } from './constants';

type TripSelectorProps = {
  trip: TripDefinition;
  onTripChange: (id: string) => void;
};

export const TripSelector = ({ trip, onTripChange }: TripSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ left: 0, top: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (window.matchMedia(MOBILE_QUERY).matches) return;
    const update = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) setMenuPos({ left: rect.left, top: rect.bottom + 4 });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const isMobile = () => window.matchMedia(MOBILE_QUERY).matches;
    const onClickOutside = (e: MouseEvent) => {
      if (isMobile()) return;
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isMobile() && activeCategory) {
        setActiveCategory(null);
      } else {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, activeCategory]);

  useEffect(() => {
    if (!isOpen) return;
    if (!window.matchMedia(MOBILE_QUERY).matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  const open = () => {
    const cat = tripEntries.find((e) => e.trip.id === trip.id)?.category ?? null;
    setActiveCategory(cat);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setActiveCategory(null);
  };

  const handleTrigger = () => (isOpen ? close() : open());

  const handleSelect = (id: string) => {
    onTripChange(id);
    close();
  };

  const childEntries = activeCategory
    ? tripsByCategory.find(([c]) => c === activeCategory)?.[1] ?? []
    : [];

  return (
    <div className="trip-selector" ref={ref}>
      <button
        ref={triggerRef}
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
        <div
          ref={menuRef}
          className="trip-selector__menu"
          role="menu"
          style={{
            '--menu-left': `${menuPos.left}px`,
            '--menu-top': `${menuPos.top}px`,
          } as CSSProperties}
        >
          <div className="trip-selector__panel trip-selector__panel--root">
            <div className="trip-selector__panel-header">
              <span className="trip-selector__panel-title">選擇行程</span>
              <button
                type="button"
                className="trip-selector__panel-close"
                onClick={close}
                aria-label="關閉"
              >
                <FaTimes />
              </button>
            </div>
            <ul className="trip-selector__list">
              {tripsByCategory.map(([category]) => {
                const isActive = activeCategory === category;
                return (
                  <li key={category}>
                    <button
                      type="button"
                      className={`trip-selector__category ${isActive ? 'is-active' : ''}`}
                      onMouseEnter={() => setActiveCategory(category)}
                      onClick={() => setActiveCategory(category)}
                    >
                      <span>{labelOfCategory(category)}</span>
                      <FaChevronRight className="trip-selector__arrow" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            className={`trip-selector__panel trip-selector__panel--child ${activeCategory ? 'is-active' : ''}`}
          >
            <div className="trip-selector__panel-header">
              <button
                type="button"
                className="trip-selector__panel-back"
                onClick={() => setActiveCategory(null)}
                aria-label="返回"
              >
                <FaChevronLeft />
              </button>
              <span className="trip-selector__panel-title">
                {activeCategory ? labelOfCategory(activeCategory) : ''}
              </span>
              <button
                type="button"
                className="trip-selector__panel-close"
                onClick={close}
                aria-label="關閉"
              >
                <FaTimes />
              </button>
            </div>
            <ul className="trip-selector__list">
              {childEntries.map(({ trip: t }) => (
                <li key={t.id}>
                  <button
                    type="button"
                    className={`trip-selector__option ${t.id === trip.id ? 'is-current' : ''}`}
                    onClick={() => handleSelect(t.id)}
                  >
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
