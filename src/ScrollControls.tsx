import { FaArrowUp, FaArrowDown, FaHome } from 'react-icons/fa';

export const ScrollControls = () => {
  const scrollTo = (top: number) => window.scrollTo({ top, behavior: 'smooth' });
  return (
    <div className="scroll-controls">
      <a
        href="#/"
        className="scroll-btn"
        aria-label="回到歷年旅行"
      >
        <FaHome />
      </a>
      <button
        type="button"
        className="scroll-btn"
        onClick={() => scrollTo(0)}
        aria-label="回到頂端"
      >
        <FaArrowUp />
      </button>
      <button
        type="button"
        className="scroll-btn"
        onClick={() => scrollTo(document.documentElement.scrollHeight)}
        aria-label="移到最底"
      >
        <FaArrowDown />
      </button>
    </div>
  );
};
