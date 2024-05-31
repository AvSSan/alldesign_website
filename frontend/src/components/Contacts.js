import React from 'react';
import styles from '../styles/Contacts.module.css';
import { FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';

const Contacts = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.icons}>
        <a href='https://wa.me/+79098728757'>
            <FaWhatsapp className={styles.icon} />
        </a>
        <a href='https://t.me/Alldesignkhv'>
            <FaTelegramPlane className={styles.icon} />
        </a>
      </div>
      <p className={styles.phone}>+7 909 872 87 57</p>
    </footer>
  );
};

export default Contacts;
