import React from 'react';
import styles from '../styles/DesktopHeader.module.css';
import companyLogo from '../static_files/logo.png';

const DesktopHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo_list}>
        <a href="/">
          <img className={styles.logo} src={companyLogo} alt="Logo" />
        </a>
        <div className={styles.leftnav}>
          <nav>
            <ul>
              <li><a href="/projects/">РАБОТЫ</a></li>
              <li><a href="/implementation">РЕАЛИЗАЦИЯ</a></li>
              <li style={{whiteSpace: "nowrap"}}><a href="/#aboutus">О НАС</a></li>   
            </ul>
          </nav>
        </div>
        <div className={styles.rightnav}>
          <nav>
            <ul>
              <li><a href="/services">УСЛУГИ</a></li>
              <li><a href="/#contacts">КОНТАКТЫ</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader; 