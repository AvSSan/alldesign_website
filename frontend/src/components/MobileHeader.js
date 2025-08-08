import React, { useState } from 'react';
import styles from '../styles/MobileHeader.module.css';
import { Menu, X } from 'lucide-react';
import companyLogo from '../static_files/logo.png';

const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.mobileHeader}>
      <div className={styles.headerContent}>
        <a href="/" className={styles.logoLink}>
          <img src={companyLogo} alt="All Design" className={styles.logo} />
        </a>
        <button 
          className={styles.menuButton} 
          onClick={toggleMenu}
          aria-label="Открыть меню"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`${styles.menuOverlay} ${isMenuOpen ? styles.menuOpen : ''}`} onClick={closeMenu}>
        <div className={styles.menuContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.menuHeader}>
            <img src={companyLogo} alt="All Design" className={styles.menuLogo} />
            <button 
              className={styles.closeButton} 
              onClick={closeMenu}
              aria-label="Закрыть меню"
            >
              <X size={24} />
            </button>
          </div>

          <nav className={styles.menuNav}>
            <ul className={styles.menuList}>
              <li className={styles.menuItem}>
                <a href="/" className={styles.menuLink} onClick={closeMenu}>Главная</a>
              </li>
              <li className={styles.menuItem}>
                <a href="/projects/" className={styles.menuLink} onClick={closeMenu}>Работы</a>
              </li>
              <li className={styles.menuItem}>
                <a href="/implementation" className={styles.menuLink} onClick={closeMenu}>Реализация</a>
              </li>
              <li className={styles.menuItem}>
                <a href="/services" className={styles.menuLink} onClick={closeMenu}>Услуги</a>
              </li>
              <li className={styles.menuItem}>
                <a href="/#aboutus" className={styles.menuLink} onClick={closeMenu}>О нас</a>
              </li>
              <li className={styles.menuItem}>
                <a href="/#contacts" className={styles.menuLink} onClick={closeMenu}>Контакты</a>
              </li>
              <li className={styles.menuItem}>
                <a href="/order" className={styles.menuLink} onClick={closeMenu}>Заказать проект</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader; 