import React from 'react';
import styles from '../styles/UnderDevelopment.module.css';
import ToMain from './ToMain';

const UnderDevelopment = () => {
  return (
    <div>
        <ToMain />
        <div className={styles.container}>
        <h1 className={styles.heading}>В разработке!</h1>
        <p className={styles.message}>Мы работаем над этой частью сайта. Пока что, вы можете узнать все, обратившись по номеру +7 909 872 87 57 </p>
    </div>
    </div>
  );
};

export default UnderDevelopment;
