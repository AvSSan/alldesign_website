import React from 'react';
import styles from '../../styles/TestimonialCard.module.css';

const testimonialCard = ({ image, text, name }) => {
  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <img src={image} alt="Тут должна была быть фотография" />
      </div>
      <div className={styles.text}>
        <p >{text}</p>
        <p className={styles.name}>{name}</p>
      </div>
    </div>
  );
};

export default testimonialCard;