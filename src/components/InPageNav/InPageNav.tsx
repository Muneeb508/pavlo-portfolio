import React from 'react';
import { Link } from 'react-router-dom';

const linkStyle: React.CSSProperties = {
  color: 'inherit',
  textDecoration: 'underline',
  marginRight: '12px',
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  margin: '18px 0',
  background: 'rgba(255,255,255,0.02)',
  padding: '12px',
  borderRadius: '6px',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
};

const InPageNav: React.FC = () => {
  return (
    <nav aria-label="In-page site navigation" style={containerStyle}>
      <div style={rowStyle}>
        <Link to="/home" style={linkStyle} aria-label="Go to Home">Home</Link>
        <Link to="/work" style={linkStyle} aria-label="Go to Work">Work</Link>
        <Link to="/photography" style={linkStyle} aria-label="Go to Photography">Photography</Link>
        <Link to="/about" style={linkStyle} aria-label="Go to About">About</Link>
        <Link to="/info" style={linkStyle} aria-label="Go to Info">Info</Link>
        <Link to="/contact" style={linkStyle} aria-label="Go to Contact">Contact</Link>
        <a href="/sitemap.html" style={linkStyle} aria-label="View sitemap">Sitemap</a>
      </div>
    </nav>
  );
};

export default InPageNav;
