import React, { useState, useRef, useEffect } from "react";

const tabs = ["How we help", "About", "Contact"];

export default function TabNavigation({ darkMode = false }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef([]);

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const firstElement = tabRefs.current[0];
      if (firstElement) {
        const { offsetLeft, offsetWidth } = firstElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, []);

  const handleTabClick = (index) => {
    setActiveIndex(index);
    const tabId = tabs[index].toLowerCase().replace(/\s+/g, '-');
    const element = document.getElementById(tabId === 'how-we-help' ? 'help' : tabId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="tab-navigation" style={{ position: 'relative' }}>
      {/* Hover Highlight */}
      <div
        className="tab-hover-highlight"
        style={{
          position: 'absolute',
          height: '32px',
          transition: 'all 300ms ease-out',
          backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(14,15,17,0.08)',
          borderRadius: '6px',
          pointerEvents: 'none',
          ...hoverStyle,
          opacity: hoveredIndex !== null ? 1 : 0,
        }}
      />

      {/* Active Indicator */}
      <div
        className="tab-active-indicator"
        style={{
          position: 'absolute',
          bottom: '-8px',
          height: '2px',
          backgroundColor: darkMode ? '#fff' : '#0b1d40',
          transition: 'all 300ms ease-out',
          pointerEvents: 'none',
          ...activeStyle,
        }}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            ref={(el) => (tabRefs.current[index] = el)}
            onClick={() => handleTabClick(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              padding: '6px 12px',
              cursor: 'pointer',
              transition: 'colors 300ms',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              color: index === activeIndex 
                ? (darkMode ? '#fff' : '#0b1d40') 
                : (darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(11,29,64,0.6)'),
              fontSize: '14px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            {tab}
          </div>
        ))}
      </div>
    </nav>
  );
}