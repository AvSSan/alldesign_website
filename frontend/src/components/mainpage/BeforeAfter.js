import React from 'react';
import styles from '../../styles/BeforeAfter.module.css';
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';

const SECOND_IMAGE = {
  imageUrl: 'https://i.postimg.cc/2j7Hw0SN/before.jpg'
};
const FIRST_IMAGE = {
  imageUrl: 'https://i.postimg.cc/x85t1141/after.jpg'
};

const BeforeAfter = () => {
  return (
    <div className={styles.beforeafter}>
        <ReactBeforeSliderComponent 
            firstImage={FIRST_IMAGE}
            secondImage={SECOND_IMAGE}
            withResizeFeel='false'
        />
    </div>
  );
};

export default BeforeAfter;