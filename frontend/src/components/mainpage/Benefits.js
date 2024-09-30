import React, { useState } from 'react';
import styles from '../../styles/Benefits.module.css';
import { Clock, FileText, Armchair, DollarSign } from 'lucide-react';

const benefitsData = [
  { icon: Clock, title: 'ВРЕМЯ', description: 'Соблюдаем сроки и график выполнения' },
  { icon: FileText, title: 'КОНТАКТЫ', description: 'Оперативная поддержка и ответы на вопросы' },
  { icon: Armchair, title: 'ОПЫТ', description: 'Многолетний опыт и экспертный подход к каждому проекту' },
  { icon: DollarSign, title: 'ДЕНЬГИ', description: 'Оптимальное соотношение цены и качества, честные и прозрачные расценки' },
];

const Benefits = () => {
    const [activeCard, setActiveCard] = useState(null);
  
    const handleCardClick = (index) => {
      setActiveCard(activeCard === index ? null : index);
    };
  
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>ПЛЮСЫ В НАШЕЙ РАБОТЕ</h2>
        <p className={styles.subtitle}>
          Один из важных критериев - это ваше доверие и положительные эмоции от полученного результата!
        </p>
        <div className={styles.cardContainer}>
          {benefitsData.map((benefit, index) => (
            <div 
              key={index} 
              className={`${styles.card} ${activeCard === index ? styles.active : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <benefit.icon className={styles.icon} />
              <h3 className={styles.cardTitle}>{benefit.title}</h3>
              <p className={styles.cardDescription}>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Benefits;