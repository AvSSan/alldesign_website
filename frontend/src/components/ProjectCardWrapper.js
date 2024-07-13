import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProjectCard from './ProjectCard';
import styles from '../styles/ProjectCardWrapper.module.css';

function ProjectCardWrapper() {
  const { id } = useParams();
  const [backgroundImage, setBackgroundImage] = useState('');
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`https://alldesignkhv.store/api/projects/${id}/`);
        setProjectData(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setBackgroundImage(response.data.images[0].image);
        }
      } catch (err) {
        setError('Ошибка при загрузке данных проекта');
        console.error('Error fetching project data:', err);
      }
    };

    fetchProjectData();
  }, [id]);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!projectData) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.pageWrapper} style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className={styles.overlay}>
        <ProjectCard projectId={id} projectData={projectData} />
      </div>
    </div>
  );
}

export default ProjectCardWrapper;