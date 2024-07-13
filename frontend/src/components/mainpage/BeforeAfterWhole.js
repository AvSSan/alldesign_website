import React from 'react';
import BeforeAfter from './BeforeAfter'; // Убедитесь, что путь к вашему компоненту BeforeAfter верный
import styles from '../../styles/BeforeAfterWhole.module.css';

const BeforeAfterWhole = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.header}>
                100% РЕАЛИЗАЦИЯ ОБЪЕКТА ПО ПРОЕКТУ!
            </h2>
            <div className={styles.beforeAfterContainer}>
                <BeforeAfter />
            </div>
        </div>
    );
};

export default BeforeAfterWhole;
