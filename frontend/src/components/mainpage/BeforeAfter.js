import React from 'react';
import styles from '../../styles/BeforeAfter.module.css';
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';

const FIRST_IMAGE = {
  imageUrl: 'https://images.wallpaperscraft.ru/image/single/ozero_derevia_gory_137604_2560x1440.jpg'
};
const SECOND_IMAGE = {
  imageUrl: 'https://i3.wp.com/wallpapercave.com/wp/wp6406961.jpg?ssl=1'
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