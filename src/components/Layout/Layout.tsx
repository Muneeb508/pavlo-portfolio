import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

export const Layout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/home';

  return (
    <>
      <Header />
      <div style={{ paddingTop: '78px' }}>
        <main id="main-content">
          <Suspense>
            <Outlet key={location.pathname} />
          </Suspense>
        </main>
      </div>
      {!isHomePage && <Footer />}
    </>
  );
};
