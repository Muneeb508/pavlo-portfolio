import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

export const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <a 
        href="#main-content" 
        style={{
          position: 'absolute',
          top: '-40px',
          left: '0',
          background: '#000',
          color: '#fff',
          padding: '8px 16px',
          textDecoration: 'none',
          zIndex: 10000,
          border: '2px solid #fff'
        }}
        onFocus={(e) => {
          e.currentTarget.style.top = '0';
        }}
        onBlur={(e) => {
          e.currentTarget.style.top = '-40px';
        }}
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Suspense>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
};