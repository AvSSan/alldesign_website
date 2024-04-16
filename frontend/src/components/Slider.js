import { useState } from 'react';
import styles from '../styles/slider.module.css';
import Carousel from 'react-bootstrap/Carousel';
import tempImg from '../static_files/temp.png';
import tempImg2 from '../static_files/temp2.png';
import tempImg3 from '../static_files/temp3.png';
import Slide from './Slide';

function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img 
            src={tempImg} 
            alt="First slide" 
            style={{ width: '100vw', height: '100vh', objectFit: 'cover', filter: 'brightness(0.5)' }}
        />
        <Carousel.Caption className={styles.caption}>
          <div className={styles.htext}>
            <h3>ДИЗАЙН ИНТЕРЬЕРОВ В ХАБАРОВСКЕ</h3>
          </div>
          <div className={styles.text}>
            <p>Дизайнер-архитектор Александр Михеев.<br/> Комплексные услуги по созданию и реализации дизайн-проекта и ремонту в Хабаровске – от идеи до результата.</p>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img 
            src={tempImg2} 
            alt="Second slide" 
            style={{ width: '100vw', height: '100vh', objectFit: 'cover', filter: 'brightness(0.5)' }}
        />
        <Carousel.Caption className={styles.caption}>
          <div className={styles.htext}>
            <h3>АВТОРСКИЙ НАДЗОР</h3>
          </div>
          <div className={styles.text}>
            <p>Экономьте время и нервы на ремонте – все проконтролируем за вас.</p>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img 
            src={tempImg3} 
            alt="Third slide" 
            style={{ width: '100vw', height: '100vh', objectFit: 'cover', filter: 'brightness(0.5)' }}
        />
        <Carousel.Caption className={styles.caption}>
          <div className={styles.htext}>
            <h3>3D-ВИЗУАЛИЗАЦИЯ</h3>
          </div>
          <div className={styles.text}>
            <p>Представьте себя в новом стильном интерьере еще до начала ремонта.</p>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;