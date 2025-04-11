import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/ProjectCarousel.module.css';
import ProjectCarouselCard from './ProjectCarouselCard';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner';

const ProjectCarousel = () => {
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://alldesignkhv.store/api/projects/');
        setProjects([...response.data, ...response.data.slice(0, visibleCards)]);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке проектов:', err);
        setError('Ошибка при загрузке проектов. Пожалуйста, попробуйте позже.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, [visibleCards]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setVisibleCards(1);
      } else if (width < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const startAutoSlide = () => {
      if (projects.length > 0 && !intervalRef.current) {
        intervalRef.current = setInterval(() => {
          if (!isPaused && !isTransitioning) {
            setIsTransitioning(true);
            setCurrentIndex(prevIndex => prevIndex + 1);
          }
        }, 3000);
      }
    };

    startAutoSlide();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [projects.length, isPaused, isTransitioning]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex >= projects.length - visibleCards) {
      setCurrentIndex(0);
    } else if (currentIndex < 0) {
      setCurrentIndex(projects.length - visibleCards - 1);
    }
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className={styles.error}>{error}</div>;
  if (projects.length === 0) return <div className={styles.noProjects}>Проекты не найдены</div>;

  return (
    <div className={styles.carouselContainer}>
      <h2 className={styles.title}>ГАЛЕРЕЯ ИНТЕРЬЕРОВ</h2>
      <p className={styles.subtitle}>Вдохновение для вашего идеального дома</p>
      <div 
        className={styles.carousel} 
        ref={carouselRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={styles.carouselTrack}
          style={{
            transform: `translateX(-${(currentIndex + 1) * (100 / visibleCards)}%)`,
            transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {projects.slice(-visibleCards).map((project, index) => (
            <div
              key={`last-${project.id}-${index}`}
              className={styles.slide}
              style={{ flex: `0 0 ${100 / visibleCards}%` }}
            >
              <ProjectCarouselCard image={project.images[0].image} title={project.title} id={project.id}/>
            </div>
          ))}
          {projects.map((project, index) => (
            <div
              key={`main-${project.id}-${index}`}
              className={styles.slide}
              style={{ flex: `0 0 ${100 / visibleCards}%` }}
            >
              <ProjectCarouselCard image={project.images[0].image} title={project.title} id={project.id}/>
            </div>
          ))}
          {projects.slice(0, visibleCards).map((project, index) => (
            <div
              key={`first-${project.id}-${index}`}
              className={styles.slide}
              style={{ flex: `0 0 ${100 / visibleCards}%` }}
            >
              <ProjectCarouselCard image={project.images[0].image} title={project.title} id={project.id}/>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.dots}>
        {projects.slice(0, projects.length - visibleCards).map((_, index) => (
          <span
            key={`dot-${index}`}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
      <a href="/projects/">
        <button className={styles.button}>
          <span>Все проекты</span>
        </button>
      </a>
    </div>
  );
};

export default ProjectCarousel;
