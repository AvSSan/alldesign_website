import React from 'react';
import Slider from 'react-slick';
import styles from '../../styles/Partners.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import one from '../../static_files/partners/one.png'
import two from '../../static_files/partners/two.png'
import three from '../../static_files/partners/three.png'
import four from '../../static_files/partners/four.png'
import five from '../../static_files/partners/five.png'
import six from '../../static_files/partners/six.png'

const Partners = () => {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            initialSlide: 1
          }
        }
      ]
    };


  return (
    <div className={styles.carouselContainer}>
      <h2 className={styles.title}>НАШИ ПАРТНЕРЫ</h2>
      <Slider className={styles.slider} {...settings}>
        <div>
          <img src={one} alt='Слайд_1' className={styles.image}/>
        </div>
        <div>
          <img src={two} alt='Слайд_2' className={styles.image}/>
        </div>
        <div>
          <img src={three} alt='Слайд_3' className={styles.image}/>
        </div>
        <div>
          <img src={four} alt='Слайд_4' className={styles.image}/>
        </div>
        <div>
          <img src={five} alt='Слайд_5' className={styles.image}/>
        </div>
        <div>
          <img src={six} alt='Слайд_6' className={styles.image}/>
        </div>
      </Slider>
    </div>
  );
};

export default Partners;
