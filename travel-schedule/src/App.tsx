import { schedule } from './data.tsx';
import './App.css';

const EventCard = ({ event }: { event: any }) => (
  <div className="event-card">
    <div className="event-icon" style={{ color: event.iconColor }}>
      {event.icon}
    </div>
    <div className="event-content">
      <div className="event-header">
        <span className="event-time" style={{ color: event.iconColor }}>{event.time}</span>
        <span className="event-title">{event.title}</span>
      </div>
      {event.details && <p className="event-details">{event.details}</p>}
    </div>
  </div>
);

const DayEntry = ({ day }: { day: any }) => (
  <div className="day-entry">
    <div className="date-column">{day.date}</div>
    <div className="events-column">
      {day.events.map((ev: any, idx: number) => (
        <EventCard key={idx} event={ev} />
      ))}
    </div>
  </div>
);

function App() {
  return (
    <div className="app-container">
      <h1 className="main-title">日本旅遊時程</h1>
      <div className="schedule-list">
        {schedule.map((day, index) => (
          <DayEntry key={index} day={day} />
        ))}
      </div>
    </div>
  );
}

export default App;
