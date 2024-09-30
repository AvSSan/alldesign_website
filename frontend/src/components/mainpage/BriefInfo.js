import React from 'react';
import styles from '../../styles/BriefInfo.module.css';
import Typewriter from 'typewriter-effect';


export default function BriefInfo({title, description, type}) {
    if (type === 'true') {
      return (
        <div className={styles.wrapper}>
          <div className={styles.card}>
            <h2 className={styles.title}>{title}</h2>
            <Typewriter
              options={{
                strings: "ДИЗАЙН ИНТЕРЬЕРА ДЛЯ ДОМА И БИЗНЕСА",
                autoStart: true,
                loop: true,
                pauseFor: 2500,
              }}
            />
            <p className={styles.description}>
              {description}
            </p>
            <a href='/order'><button className={styles.button}>УЗНАТЬ</button></a>
          </div>
        </div>
        );
    } else {
      return (
        <div className={styles.wrapper}>
          <div className={styles.card}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>
              {description}
            </p>
            <a href='/order'><button className={styles.button}>УЗНАТЬ</button></a>
          </div>
        </div>
        );
    }


};

