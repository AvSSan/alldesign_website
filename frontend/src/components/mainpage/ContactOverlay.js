import React from 'react';
import styles from '../../styles/ContactOverlay.module.css';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';

const ContactOverlay = () => {
  return (
    <div className={styles.container}>
        <div className={styles.wrapper}>
            <div className={styles.overlay}>
              <h2 className={styles.title}>КАК НАС НАЙТИ</h2>

              <div className={styles.contactInfo}>
                <div className={styles.infoItem}>
                  <MapPin className={styles.icon} />
                  <p>Адрес: Россия, Хабаровск, улица Блюхера 5, офис 207</p>
                </div>

                <div className={styles.infoItem}>
                  <Phone className={styles.icon} />
                  <p>Телефон: +7 (909) 872 87 57</p>
                </div>

                <div className={styles.infoItem}>
                  <Mail className={styles.icon} />
                  <p>E-mail: <b>all.design.98@mail.ru</b></p>
                </div>
              </div>

              <div className={styles.requestInfo}>
                <p>Чтобы записаться на встречу оставьте заявку и укажите свои пожелания для дизайн-проекта</p>
                <a href='/order'><button className={styles.requestButton}>ОТПРАВИТЬ ЗАЯВКУ</button></a>
              </div>

              <div className={styles.socialIcons}>
                
              </div>
            </div>
        </div>
    </div>
  );
};

export default ContactOverlay;