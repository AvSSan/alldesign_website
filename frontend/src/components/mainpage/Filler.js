import React from 'react';
import styles from '../../styles/Filler.module.css';
import fillerImg from '../../static_files/blackmarble.png';
import BriefInfo from './BriefInfo';

const Filler = () => {
  return (
    <div className={styles.fillerContainer}>
      <div className={styles.briefInfoWrapper}>
        <BriefInfo />
      </div>
      <div className={styles.filler}>
        <img src={fillerImg} alt="Filler" className={styles.fillerImage} />
      </div>
    </div>
  );
};

export default Filler;