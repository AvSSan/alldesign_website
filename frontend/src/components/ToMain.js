import React from 'react';
import styles from '../styles//ToMain.module.css';

const ToMain = () => {
  return (
    <header className={styles.header}>
      <a href="/" className={styles.link}>
        На главную
      </a>
    </header>
  );
};

export default ToMain;
