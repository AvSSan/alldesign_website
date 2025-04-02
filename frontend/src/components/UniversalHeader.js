import React from 'react';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import styles from '../styles/UniversalHeader.module.css';

const UniversalHeader = () => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.desktopHeader}>
        <DesktopHeader />
      </div>
      <div className={styles.mobileHeader}>
        <MobileHeader />
      </div>
    </div>
  );
};

export default UniversalHeader; 