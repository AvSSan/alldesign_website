import React from 'react';
import styles from '../styles/TEMP.module.css';

const TEMPCARD = ({ image, title, description }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardImage}>
        <img src={image} alt={title} />
      </div>
      <div className={styles.cardContent}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default TEMPCARD;