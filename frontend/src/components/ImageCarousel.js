import { useState } from 'react';
import styles from '../styles/slider.module.css';
import Carousel from 'react-bootstrap/Carousel';
import tempImg from '../static_files/temp.png';
import tempImg2 from '../static_files/temp2.png';
import tempImg3 from '../static_files/temp3.png';

export default function ImageCarousel() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
      setIndex(selectedIndex);
    };
    return(
        <Carousel activeIndex={index} onSelect={handleSelect}>
          <Carousel.Item>
            <img 
                src={tempImg} 
                alt="First slide" 
                style={{ width: '100%', height: '100%', borderRadius: '50px'}}
            />
          </Carousel.Item>
          <Carousel.Item>
            <img 
                src={tempImg2} 
                alt="Second slide" 
                style={{ width: '100%', height: '100%', borderRadius: '50px'}}
            />
          </Carousel.Item>
          <Carousel.Item>
            <img 
                src={tempImg3} 
                alt="Third slide" 
                style={{ width: '100%', height: '100%', borderRadius: '50px'}}
            />
          </Carousel.Item>
        </Carousel>
    )
}