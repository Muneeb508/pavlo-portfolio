import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Wrapper, BurgerButton, Line, MenuOverlay, MenuLink, MenuLinksContainer } from './MobileMenu.styled';
import { StyledNavLink } from '../Header/Header.styled';


const topLineVariants = {
  open: { rotate: 45, y: 14 },
  closed: { rotate: 0, y: 0 },
};

const middleLineVariants = {
  open: { opacity: 0 },
  closed: { opacity: 1 },
};

const bottomLineVariants = {
  open: { rotate: -45, y: -14 },
  closed: { rotate: 0, y: 0 },
};

const menuVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: '-100%' },
};

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const navLinks = [
    { to: '/home', label: 'HOME' },
    { to: '/work', label: 'WORK' },
    { to: '/photography', label: 'PHOTOGRAPHY' },
    { to: '/info', label: 'INFO' },
    { to: '/contact', label: 'CONTACTS' },
    { to: '/about', label: 'ABOUT ME' },
    { to: '/sitemap.html', label: 'SITEMAP', isExternal: true, hidden: true },
  ];

  return (
    <Wrapper>
      <BurgerButton 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <Line animate={isOpen ? 'open' : 'closed'} variants={topLineVariants} />
        <Line animate={isOpen ? 'open' : 'closed'} variants={middleLineVariants} />
        <Line animate={isOpen ? 'open' : 'closed'} variants={bottomLineVariants} />
      </BurgerButton>

      <AnimatePresence>
        {isOpen && (
          <MenuOverlay
            id="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ duration: 0.3 }}
            aria-label="Mobile navigation menu"
          >
            <MenuLinksContainer>
              {navLinks.map((link, index) => (
                <MenuLink 
                  key={index} 
                  onClick={() => setIsOpen(false)}
                  style={{ display: link.hidden ? 'none' : 'block' }}
                >
                  {link.isExternal ? (
                    <a href={link.to} style={{ textDecoration: 'none', color: 'inherit' }}>{link.label}</a>
                  ) : (
                    <StyledNavLink to={link.to}>{link.label}</StyledNavLink>
                  )}
                </MenuLink>
              ))}
            </MenuLinksContainer>
          </MenuOverlay>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};

export default BurgerMenu;
