import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { schedule } from './data.tsx';
import './App.css';

function App() {
  return (
    <div className="App py-5">
      <h1 className="main-title text-center mb-5">日本旅遊時程</h1>
      <VerticalTimeline layout="1-column-left">
        {schedule.map((item, index) => (
          <VerticalTimelineElement
            key={index}
            className="vertical-timeline-element--work"
            contentStyle={{ background: '#fff', color: '#333', boxShadow: '0px 3px 10px rgba(0,0,0,0.1)' }}
            contentArrowStyle={{ borderRight: '7px solid #fff' }}
            date={item.date}
            iconStyle={item.iconStyle}
            icon={item.icon}
          >
            <h3 className="vertical-timeline-element-title">{item.title}</h3>
            {item.subtitle && <h4 className="vertical-timeline-element-subtitle text-muted">{item.subtitle}</h4>}
            <p>{item.details}</p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
}

export default App;
