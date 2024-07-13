import React from 'react';
import styles from '../../styles/BriefInfo.module.css';
import Typewriter from 'typewriter-effect';


export default function BriefInfo() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h2 className={styles.title}>ДЛЯ ВАС</h2>
          <Typewriter
            options={{
              strings: "ДИЗАЙН ИНТЕРЬЕРА ДЛЯ ДОМА И БИЗНЕСА",
              autoStart: true,
              loop: true,
              pauseFor: 2500,
            }}
          />
          <p className={styles.description}>
            All Design предлагает для вас услуги по дизайну интерьера
            полного цикла. Для вашего блага мы проектируем, комплектуем и
            строим ваши объекты. Выполняем индивидуальные интерьеры
            разработанные исключительно под ваши потребности. Напишите нам о
            вашем объекте и узнайте сколько это будет стоить.
          </p>
          <button className={styles.button}>УЗНАТЬ</button>
        </div>
      </div>
      );
};

