import React, { useState } from 'react';
import styles from '../../styles/ServiceList.module.css';

const ServiceList = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleService = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const services = [
    {
      title: 'Планировочный проект',
      content: `
        <ul class="${styles.serviceText}">
          <li class="${styles.serviceText}">Обмерочный план</li>
          <li class="${styles.serviceText}">Планировочное решение с расстановкой мебели</li>
          <li class="${styles.serviceText}">Схема расположения сантехники</li>
          <li class="${styles.serviceText}">Схема расположения источников света, светильников и розеток</li>
        </ul>
        <p class="${styles.serviceText}">Такой проект планировки или перепланировки необходим, когда нужно сделать зонирование помещений, грамотно расставить мебель, сантехнику и оборудование. При этом вам не требуется 3D-визуализация.</p>
      `,
    },
    {
      title: 'Технический проект',
      content: `
        <ul class="${styles.serviceText}"}>
          <li class="${styles.serviceText}">Планировка с экспликацией помещений</li>
          <li class="${styles.serviceText}">План сносимых и возводимых перегородок</li>
          <li class="${styles.serviceText}">Развертки по стенам с указанием материалов и схемы их раскладки</li>
          <li class="${styles.serviceText}">Планы полов, монтажа потолков, расположения сантехники</li>
          <li class="${styles.serviceText}"}>Схема расположения источников света, привязки светильников, расположения розеток</li>
          <li class="${styles.serviceText}"}>Ведомость отделочных материалов</li>
        </ul>
        <p class="${styles.serviceText}">Такой проект включает полный комплект рабочих чертежей и спецификаций. Единственное отличие от полного проекта - отсутствие 3D-визуализации.</p>
      `,
    },
    {
      title: 'Полный дизайн-проект',
      content: `
        <ul class="${styles.serviceText}">
          <li class="${styles.serviceText}">Обмерочный план проекта</li>
          <li class="${styles.serviceText}">План сносимых и возводимых перегородок</li>
          <li class="${styles.serviceText}">Планировочное решение с расстановкой мебели</li>
          <li class="${styles.serviceText}">Фотореалистичная визуализация</li>
          <li class="${styles.serviceText}">Координация разверток по стенам</li>
          <li class="${styles.serviceText}">Развертки с указанием материалов</li>
          <li class="${styles.serviceText}">Планы раскладки напольных покрытий, монтажа потолков, расположения сантехники</li>
          <li class="${styles.serviceText}">Схема расположения источников света, привязки светильников, расположения розеток</li>
          <li class="${styles.serviceText}">Ведомость отделочных материалов.</li>
        </ul>
        <p class="${styles.serviceText}">Это полный технический проект и визуализация для качественного ремонта и контроля.</p>
      `,
    },
    {
      title: 'Авторский надзор',
      content: `<p class="${styles.serviceText}">Контроль за реализацией дизайн-проекта.</p>`,
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>НАШИ УСЛУГИ</h2>
      <p className={styles.subheading}>За подробной информацией обращайтесь к нам по телефону: +7 909 872 87 57</p>
      {services.map((service, index) => (
        <div key={index} className={styles.service}>
          <div className={styles.serviceHeader} onClick={() => toggleService(index)}>
            <h3 className={styles.serviceTitle}>{service.title}</h3>
            <span className={`${styles.icon} ${activeIndex === index ? styles.active : ''}`}>
              {activeIndex === index ? '×' : '+'}
            </span>
          </div>
          <div
            className={`${styles.serviceContent} ${activeIndex === index ? styles.show : ''}`}
            dangerouslySetInnerHTML={{ __html: service.content }}
          />
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
