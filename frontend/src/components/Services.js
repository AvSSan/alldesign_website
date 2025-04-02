import React from 'react';
import styles from '../styles/Services.module.css';
import UniversalHeader from './UniversalHeader';
import Contacts from './mainpage/Contacts';

const Services = () => {
  const services = [
    {
      description: "Вы приобрели квартиру в новостройках спального района города и необходим косметический ремонт.",
      service: "ПЛАНИРОВОЧНОЕ РЕШЕНИЕ"
    },
    {
      description: "Вам не нужны визуализации, так как вы понимаете чертежи и 3D схемы - услуга",
      service: "СТРОИТЕЛЬНЫЙ"
    },
    {
      description: "У вас есть квартира в жк Хабаровска с голыми стенами или ремонтом от предыдущих хозяев и вы не знаете с чего начать ремонт.",
      service: "ПОЛНЫЙ ДИЗАЙН-ПРОЕКТ"
    },
    {
      description: "Вы деловой человек, которому необходим максимальный сервис с минимальным участием в процессе создания и реализации интерьера.. Вам важны четкость сроков и соответствие результата дизайн-проекту.",
      service: "АВТОРСКИЙ НАДЗОР"
    }
  ];

  const projectTypes = [
    {
      title: "ПЛАНИРОВОЧНОЕ РЕШЕНИЕ",
      price: "от 1200 р/м2",
      items: [
        "Обмерный план",
        "План демонтожа",
        "План монтажа",
        "План перепланировки",
        "План расстановки мебели"
      ]
    },
    {
      title: "СТРОИТЕЛЬНЫЙ",
      price: "от 1700 р/м2",
      items: [
        "Обмерный план",
        "План демонтожа",
        "План монтажа",
        "План перепланировки",
        "План расстановки мебели",
        "План привязок сантех.оборудования",
        "План потолков",
        "План привязки светильников",
        "План размещения и взаимодействия светильников и выключаетелей",
        "План электрооборудования",
        "План напольных покрытий",
        "План теплого пола",
        "Координация разверток",
        "Развертки"
      ]
    },
    {
      title: "ПОЛНЫЙ ПРОЕКТ",
      price: "от 2200 р/м2",
      items: [
        "СТРОИТЕЛЬНЫЙ",
        "3D-визуализация всех помещений",
        "Смета материалов",
        "Встреча со строителями на объекте до начала ремонтных работ (уточнения по проекту)"
      ]
    },
    {
      title: "АВТОРСКИЙ НАДЗОР",
      price: "от 20000 р в месяц",
      items: []
    }
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Услуги дизайна интерьера",
    "provider": {
      "@type": "Organization",
      "name": "All Design"
    },
    "offers": projectTypes.map(project => ({
      "@type": "Offer",
      "name": project.title,
      "price": project.price,
      "description": project.items.join(", ")
    }))
  };

  return (
    <div>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
      <UniversalHeader />
      <div className={styles.container}>
        <h2 className={styles.title}>УСЛУГИ И ЦЕНЫ</h2>
        <div className={styles.subtitle}>
          Вам нужен дизайнер интерьеров в Хабаровске или удаленно? Мы вам будем полезны, если:
        </div>
        <ul className={styles.serviceList}>
          {services.map((item, index) => (
            <li key={index} className={styles.serviceItem}>
              <span className={styles.checkmark}>✓</span>
              <div>
                <p>{item.description}</p>
                <p>Услуга <strong>{item.service}</strong></p>
              </div>
            </li>
          ))}
        </ul>
        
        <h2 className={styles.title}>СТОИМОСТЬ</h2>
        <div className={styles.subtitle}>
          На ваш выбор представлены несколько вариантов дизайн-проектов, с различным составом работ
        </div>
        <div className={styles.projectTypes}>
          {projectTypes.map((project, index) => (
            <div key={index} className={styles.projectCard}>
              <h3>{project.title}</h3>
              <p className={styles.price}>{project.price}</p>
              <ul>
                {project.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
              <a href='/order'><button className={styles.orderButton}>ЗАКАЗАТЬ</button></a>
            </div>
          ))}
        </div>
      </div>
      <div id="contacts">
        <Contacts />
      </div>
    </div>
  );
};

export default Services;