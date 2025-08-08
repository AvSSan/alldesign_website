import React from 'react';
import styles from '../../styles/AboutUs.module.css';
import image from '../../static_files/miheev.webp';


const AboutUs = () => {
  return (
    <div className={styles.container} id="aboutus">
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h1 className={styles.heading}>
            О нас
          </h1>
          <p className={styles.paragraph}>
            Меня зовут Александр Михеев. Я являюсь архитектором-дизайнером с высшим образованием ведущего технического вуза Хабаровского края. Опыт работы в сфере создания дизайн-проектов более 5 лет.
          </p>
          <p className={styles.paragraph}>
            В нашей команде работают визуализаторы, которые создают фотореалистичные изображения ваших квартир и домов. Также мы организовываем работу ремонтных бригад, авторский надзор, что позволяет вам экономить время и деньги на создании интерьера мечты.
          </p>
          <p className={styles.paragraph}>
            В нашем портфолио десятки дизайн-проектов и реализованных дизайнерских ремонтов. Мы создаем не только стильное и эстетичное пространство, но и технически грамотные и функциональные помещения, жизнь в которых будет максимально комфортна.
          </p>
        </div>
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            <img className={styles.image} src={image} alt="Дизайнер интерьеров All Design" loading="lazy" />
          </div>
          <div className={styles.paragraph2}>Михеев Александр, <br />дизайнер интерьеров All Design</div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;