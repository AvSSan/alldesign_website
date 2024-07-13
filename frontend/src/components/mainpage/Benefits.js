import React, { useState } from 'react';
import styles from '../../styles/Benefits.module.css';
import { Clock, FileText, Armchair, DollarSign } from 'lucide-react';

const benefitsData = [
  { icon: Clock, title: 'ВРЕМЯ', description: 'Тут будет какой-то умный текст про время' },
  { icon: FileText, title: 'КОНТАКТЫ', description: 'Тут будет какой-то умный текст про контакты, исполнителей и прочее подобное' },
  { icon: Armchair, title: 'ОПЫТ', description: 'Тут будет текст про то, какая опытная у тебя организация' },
  { icon: DollarSign, title: 'ДЕНЬГИ', description: 'Тут будет текст про деньги' },
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