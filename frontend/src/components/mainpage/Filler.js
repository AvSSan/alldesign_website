import React from 'react';
import styles from '../../styles/Filler.module.css';
import fillerImg from '../../static_files/blackmarble.png';
import BriefInfo from './BriefInfo';

const Filler = () => {
  return (
    <div className={styles.fillerContainer}>
      <div className={styles.briefInfoWrapper}>
        <BriefInfo
          title='ДЛЯ ВАС'
          description='All Design предлагает для вас услуги по дизайну интерьера
            полного цикла. Для вашего блага мы проектируем, комплектуем и
            строим ваши объекты. Выполняем индивидуальные интерьеры
            разработанные исключительно под ваши потребности. Напишите нам о
            вашем объекте и узнайте сколько это будет стоить.'
          type='true'
        />
      </div>
      <div className={styles.filler}>
        <img src={fillerImg} alt="Filler" className={styles.fillerImage} loading="lazy" />
      </div>
    </div>
  );
};

export default Filler;