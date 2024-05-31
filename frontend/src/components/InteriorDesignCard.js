import React from 'react';
import styles from '../styles/InteriorDesignCard.module.css';

const InteriorDesignCard = ({ image, place, title, description, parameters }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardimage}>
        <img className={styles.image} src={image} alt="First slide" />
      </div>
      <div className={styles.cardinfo}>
        <div className={styles.cardplace}>{place}</div>
        <div className={styles.cardtext}>
            <div className={styles.cardtitle}>{title}</div>
            <div className={styles.carddescription}>{description}</div>
            <ul className={styles.cardparameters}>
              {parameters.map((param, index) => (
                <li className={styles.cardparam} key={index}>{param}</li>
              ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default InteriorDesignCard;