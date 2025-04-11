import React from 'react';
import styles from '../../styles/ContactOverlay.module.css';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaWhatsapp, FaTelegramPlane, FaInstagram } from 'react-icons/fa';

const ContactOverlay = () => {
  return (
    <div className={styles.container} id="contact-section">
      <div className={styles.wrapper}>
        <div className={styles.overlay}>
          <h2 className={styles.title}>КОНТАКТНАЯ ИНФОРМАЦИЯ</h2>
          
          <div className={styles.contactInfo}>
            <div className={styles.infoItem}>
              <div className={styles.iconWrapper}>
                <MapPin className={styles.icon} />
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Адрес</h3>
                <p>Россия, Хабаровск, улица Блюхера 5, офис 207</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconWrapper}>
                <Phone className={styles.icon} />
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Телефон</h3>
                <p>+7 (909) 872 87 57</p>
                <div className={styles.socialLinks}>
                  <a
                    href="https://wa.me/+79098728757"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    title="WhatsApp"
                  >
                    <FaWhatsapp />
                  </a>
                  <a
                    href="https://t.me/Alldesignkhv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    title="Telegram"
                  >
                    <FaTelegramPlane />
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconWrapper}>
                <Mail className={styles.icon} />
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>E-mail</h3>
                <a href="mailto:all.design.98@mail.ru" className={styles.emailLink}>
                  all.design.98@mail.ru
                </a>
              </div>
            </div>
          </div>

          <div className={styles.requestInfo}>
            <p>Хотите создать проект вашей мечты?</p>
            <a href='/order'>
              <button className={styles.requestButton}>
                <span>Оставить заявку</span>
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactOverlay;