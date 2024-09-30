import React, { useState } from 'react';
import styles from '../../styles/WorkStages.module.css';

const stagesData = [
  { icon: '1', title: 'ЗНАКОМСТВО', description: 'Отправьте заявку на дизайн-проект чтобы рассчитать стоимость и получить персональное предложение!' },
  { icon: '2', title: 'ПОДПИСАНИЕ ДОГОВОРА', description: 'На встречу принесите: план объекта, примеры предпочтений, список пожеланий и позитивный настрой' },
  { icon: '3', title: '1 ЭТАП ДИЗАЙН-ПРОЕКТА', description: 'Обмерный план, фотофиксация объекта, заполнение технического задания, планировочное решение' },
  { icon: '4', title: '2 ЭТАП "ВИЗУАЛЬНЫЙ"', description: 'Создание 3D-модели вашего будщего интерьера' },
  { icon: '5', title: '3 ЭТАП "ЧЕРТЕЖИ"', description: 'Рабочие чертежи: точное отображение элементов проекта для минимизации ошибок при строительстве' },
  { icon: '6', title: 'КОМПЛЕКТАЦИЯ И НАДЗОР', description: 'Подбор материалов и мебели, контроль закупок и реализации проекта для точного воплощения дизайн-концепции' },
  { icon: '7', title: 'СДАЧА ОБЪЕКТА', description: 'Устранение недочетов и передача готового интерьера заказчику в полном соответствии с проектом' },
];

const WorkStages = () => {
    const [activeCard, setActiveCard] = useState(null);
  
    const handleCardClick = (index) => {
      setActiveCard(activeCard === index ? null : index);
    };
  
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>ЭТАПЫ РАБОТЫ</h2>
        <div className={styles.cardContainer}>
          {stagesData.map((benefit, index) => (
            <div 
              key={index} 
              className={`${styles.card} ${activeCard === index ? styles.active : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <h1 className={styles.icon}>{benefit.icon}</h1>
              <h3 className={styles.cardTitle}>{benefit.title}</h3>
              <p className={styles.cardDescription}>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default WorkStages;