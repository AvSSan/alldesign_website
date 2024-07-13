import React from 'react';
import styles from '../../styles/ProjectCarouselCard.module.css';

const ProjectCarouselCard = ({ id, image, title }) => {
  return (
    <div className={styles.card}>
      <a href={`/project/${id}`}>
        <img src={image} alt={title} className={styles.image} />
        <div className={styles.title}>{title}</div>
      </a>
    </div>
  );
};

export default ProjectCarouselCard;
