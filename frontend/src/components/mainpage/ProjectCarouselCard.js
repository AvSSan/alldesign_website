import React from 'react';
import styles from '../../styles/ProjectCarouselCard.module.css';

const ProjectCarouselCard = ({ id, image, title }) => {
  return (
    <div className={styles.card}>
      <a href={`/project/${id}`} className={styles.cardLink}>
        <div className={styles.imageContainer}>
          <img src={image} alt={title} className={styles.image} loading="lazy" />
          <div className={styles.overlay}>
            <span className={styles.viewButton}>Смотреть проект</span>
          </div>
        </div>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>{title}</h3>
        </div>
      </a>
    </div>
  );
};

export default ProjectCarouselCard;
