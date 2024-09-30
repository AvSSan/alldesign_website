import React from 'react';
import BeforeAfter from './BeforeAfter'; // Убедитесь, что путь к вашему компоненту BeforeAfter верный
import styles from '../../styles/BeforeAfterWhole.module.css';

const BeforeAfterWhole = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                100% РЕАЛИЗАЦИЯ <br></br>ОБЪЕКТА!
            </h2>
            <div className={styles.beforeAfterContainer}>
                <BeforeAfter />
            </div>
        </div>
    );
};

export default BeforeAfterWhole;
