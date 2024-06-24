import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import styles from '../styles/Testimonials.module.css';
import TestimonialCard from './TestimonialCard';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    axios.get('https://alldesignkhv.store/api/testimonials/')
      .then(response => {
        const uniqueTestimonials = response.data.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
        setTestimonials(uniqueTestimonials);
      })
      .catch(error => {
        console.error('There was an error fetching the testimonials', error);
      });
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className={styles.container}>
        <h1 className={styles.heading}>ОТЗЫВЫ НАШИХ КЛИЕНТОВ</h1>
        <Slider {...settings} className={styles.testimonials}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} image={testimonial.image} text={testimonial.text} name={testimonial.name} />
          ))}
        </Slider>
    </div>

  );
};

export default Testimonials;
