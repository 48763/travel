import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { FaChevronDown, FaTimes } from 'react-icons/fa';
import { tripsByCategory, labelOfCategory } from './trips';
import type { TripDefinition } from './trip';
import { MOBILE_QUERY } from './constants';

type TripSelectorProps = {
  trip: TripDefinition;
  onTripChange: (id: string) => void;
};

export const TripSelector = ({ trip, onTripChange }: TripSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
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
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (!window.matchMedia(MOBILE_QUERY).matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const handleTrigger = () => (isOpen ? close() : setIsOpen(true));

  const handleSelect = (id: string) => {
    onTripChange(id);
    close();
  };

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

      {isOpen && createPortal(
        <div
          ref={menuRef}
          className="trip-selector__menu"
          role="menu"
          style={{
            '--menu-left': `${menuPos.left}px`,
            '--menu-top': `${menuPos.top}px`,
          } as CSSProperties}
        >
          <div className="trip-selector__panel">
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
            <div className="trip-selector__list">
              {tripsByCategory.map(([category, entries]) => (
                <section key={category} className="trip-selector__group">
                  <h3 className="trip-selector__group-label">
                    {labelOfCategory(category)}
                    <span className="trip-selector__group-count"> · {entries.length} 趟</span>
                  </h3>
                  <ul className="trip-selector__group-list">
                    {entries.map(({ trip: t }) => (
                      <li key={t.id}>
                        <button
                          type="button"
                          className={`trip-selector__option ${t.id === trip.id ? 'is-current' : ''}`}
                          onClick={() => handleSelect(t.id)}
                        >
                          <span className="trip-selector__option-title">{t.title}</span>
                          {t.id === trip.id && (
                            <span className="trip-selector__option-current" aria-label="目前">
                              ●
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
};
