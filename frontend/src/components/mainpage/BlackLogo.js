import React from 'react';
import styles from '../../styles/BlackLogo.module.css';
import blackCompanyLogo from '../../static_files/blacklogo.png';



export default function BlackLogo() {
    return (
      <div className={styles.blacklogoContainer}>
        <img src={blackCompanyLogo} className={styles.blacklogo} loading="lazy" />
      </div>
      );
};

