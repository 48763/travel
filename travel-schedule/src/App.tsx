import { useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { schedule } from './data.tsx';
import './App.css';
import { FaBars, FaTimes } from 'react-icons/fa';

interface SidebarProps {
  isOpen: boolean;
  schedule: any[];
  onLinkClick: () => void;
}

const Sidebar = ({ isOpen, schedule, onLinkClick }: SidebarProps) => (
  <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
    <h3 className="sidebar-title">行程總覽</h3>
    <ul>
      {schedule.map((day: any) => (
        <li key={day.id}>
          <a href={`#${day.id}`} onClick={onLinkClick}>{day.date}</a>
        </li>
      ))}
    </ul>
  </nav>
);

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  
  const handleLinkClick = () => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`app-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} schedule={schedule} onLinkClick={handleLinkClick} />
      
      <button onClick={toggleSidebar} className="sidebar-toggle">
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <main className="main-content" onClick={handleLinkClick}>
        <div className="content-wrapper">
          <h1 className="main-title text-center mb-5">日本旅遊時程</h1>
          {schedule.map((day: any) => (
             <section id={day.id} key={day.id} className="day-section">
                <VerticalTimeline layout="1-column-left">
                  <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    contentStyle={{ background: '#fff', color: '#333', boxShadow: '0px 3px 10px rgba(0,0,0,0.1)' }}
                    contentArrowStyle={{ borderRight: '7px solid #fff' }}
                    date={day.date}
                    iconStyle={day.iconStyle}
                    icon={day.icon}
                  >
                    <h3 className="vertical-timeline-element-title">{day.title}</h3>
                    {day.subtitle && <h4 className="vertical-timeline-element-subtitle text-muted">{day.subtitle}</h4>}
                    <p>{day.details}</p>
                  </VerticalTimelineElement>
                </VerticalTimeline>
             </section>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
