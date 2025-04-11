import React from 'react';
import styles from '../../styles/Contacts.module.css';
import { FaWhatsapp, FaTelegramPlane, FaInstagram, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import companyLogo from '../../static_files/logo.png';

const Contacts = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerColumn}>
          <img src={companyLogo} alt="All Design" className={styles.footerLogo} />
          <p className={styles.tagline}>Современный дизайн интерьера</p>
        </div>
        
        <div className={styles.footerColumn}>
          <h3 className={styles.columnTitle}>Контакты</h3>
          <div className={styles.contactItem}>
            <FaMapMarkerAlt className={styles.contactIcon} />
            <p>г. Хабаровск, улица Блюхера 5, офис 207</p>
          </div>
          <div className={styles.contactItem}>
            <FaEnvelope className={styles.contactIcon} />
            <p>info@alldesignkhv.ru</p>
          </div>
          <div className={styles.contactItem}>
            <p className={styles.phone}>+7 909 872 87 57</p>
          </div>
        </div>
        
        <div className={styles.footerColumn}>
          <h3 className={styles.columnTitle}>Разделы</h3>
          <div className={styles.footerLinks}>
            <a href="/" className={styles.footerLink}>Главная</a>
            <a href="/projects" className={styles.footerLink}>Проекты</a>
            <a href="/services" className={styles.footerLink}>Услуги</a>
            <a href="/privacy" className={styles.footerLink}>Политика конфиденциальности</a>
          </div>
        </div>
        
        <div className={styles.footerColumn}>
          <h3 className={styles.columnTitle}>Мы в соцсетях</h3>
          <div className={styles.icons}>
            <a href='https://wa.me/+79098728757' aria-label="WhatsApp">
              <FaWhatsapp className={styles.icon} />
            </a>
            <a href='https://t.me/Alldesignkhv' aria-label="Telegram">
              <FaTelegramPlane className={styles.icon} />
            </a>
            <a href='https://instagram.com/alldesign_khv' aria-label="Instagram">
              <FaInstagram className={styles.icon} />
            </a>
          </div>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p className={styles.copyright}>© {currentYear} All Design. Все права защищены.</p>
        <p className={styles.createdby}>Разработка: <a className={styles.createdbylink} href='https://t.me/kim_deog_seon'>kim_deog_seon</a></p>
      </div>
    </footer>
  );
};

export default Contacts;
