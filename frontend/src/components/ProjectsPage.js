import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import styles from '../styles/ProjectsPage.module.css';
import ToMain from './ToMain'

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('https://alldesignkhv.store/api/projects/');
      setProjects(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (projects.length === 0) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div>
        <div>
            <ToMain />
        </div>
        <div className={styles.pageWrapper}>
          <div className={styles.container}>
            <div className={styles.gridContainer}>
              {projects.map((project) => (
                <a
                  key={project.id}
                  href={`/project/${project.id}`}
                  className={styles.projectItem}
                >
                  <img
                    src={project.images[0].image}
                    alt={project.title}
                    className={styles.projectImage}
                  />
                  <div className={styles.projectOverlay}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
};

export default ProjectsPage;