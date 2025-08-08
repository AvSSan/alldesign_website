import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/ImplementationPage.module.css';
import UniversalHeader from './UniversalHeader';
import Contacts from './mainpage/Contacts';
import { implementationService } from '../services/implementationService';
import LoadingSpinner from './LoadingSpinner';

const ImplementationPage = () => {
  const [implementations, setImplementations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Вспомогательная функция для получения URL изображения
  const getImageUrl = (implementation) => {
    if (implementation.main_image_url) {
      return implementation.main_image_url;
    }
    
    // Проверяем, может быть прямая ссылка на изображение
    if (implementation.main_image && typeof implementation.main_image === 'string') {
      if (implementation.main_image.startsWith('http')) {
        return implementation.main_image;
      }
      // Если изображение не начинается с http, но это строка - пробуем добавить домен
      return `https://alldesignkhv.store${implementation.main_image}`;
    }
    
    return "https://via.placeholder.com/600x400?text=Нет+изображения";
  };

  useEffect(() => {
    const fetchImplementations = async () => {
      try {
        const data = await implementationService.getAllImplementations();
        setImplementations(data);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке реализаций проектов');
        setLoading(false);
      }
    };

    fetchImplementations();
  }, []);

  if (loading) {
    return (
      <div>
        <UniversalHeader />
        <div className={styles.pageWrapper}>
          <div className={styles.container}>
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <UniversalHeader />
        <div className={styles.pageWrapper}>
          <div className={styles.container}>
            <div className={styles.errorMessage}>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UniversalHeader />
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.projectsGrid}>
            {implementations.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                <Link
                  to={`/implementation/${project.id}`}
                  className={styles.projectImageContainer}
                >
                  <img
                    src={getImageUrl(project)}
                    alt={project.title}
                    className={styles.projectImage}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/600x400?text=Ошибка+загрузки";
                    }}
                  />
                  <div className={styles.projectOverlay}>
                    <div className={styles.stagesPreview}>
                      {project.stages && project.stages.length > 0 ? (
                        project.stages.map((stage, index) => (
                          <div key={index} className={styles.stageItem}>
                            <span className={styles.stageName}>{stage.title}</span>
                            <span className={styles.stageDate}>
                              {new Date(stage.start_date).toLocaleDateString('ru-RU', {
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className={styles.stageItem}>
                          <span className={styles.stageName}>Нет этапов</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
                <div className={styles.projectInfo}>
                  <Link to={`/implementation/${project.id}`} className={styles.projectTitleLink}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                  </Link>
                  <p className={styles.projectDescription}>
                    {project.description}
                  </p>
                  <div className={styles.projectProgress}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ 
                          width: `${(project.stages.filter(s => s.is_completed).length / project.stages.length) * 100}%` 
                        }}
                      />
                    </div>
                    <span className={styles.progressText}>
                      {project.is_completed ? 'Проект завершен' : 'Проект в работе'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div id="contacts">
        <Contacts />
      </div>
    </div>
  );
};

export default ImplementationPage; 