import React from 'react';
import styles from '../styles/ToMain.module.css';

const ToMain = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="/" className={styles.link}>
          На главную
        </a>
      </div>
    </header>
  );
};

export default ToMain;