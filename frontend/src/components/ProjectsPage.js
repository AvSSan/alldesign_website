import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/ProjectsPage.module.css';
import UniversalHeader from './UniversalHeader';
import Contacts from './mainpage/Contacts';
import LoadingSpinner from './LoadingSpinner';

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
    return <LoadingSpinner />;
  }

  return (
    <div>
        <UniversalHeader />
        <div className={styles.pageWrapper}>
          <div className={styles.container}>
            <div className={styles.projectsGrid}>
              {projects.map((project) => (
                <div key={project.id} className={styles.projectCard}>
                  <a
                    href={`/project/${project.id}`}
                    className={styles.projectImageContainer}
                  >
                    <img
                      src={project.images[0].image}
                      alt={project.title}
                      className={styles.projectImage}
                      loading="lazy"
                    />
                  </a>
                  <div className={styles.projectInfo}>
                    <a href={`/project/${project.id}`} className={styles.projectTitleLink}>
                      <h3 className={styles.projectTitle}>{project.title}</h3>
                    </a>
                    <p className={styles.projectDetails}>
                      {project.location && `${project.location}, `}
                      {project.room_parameters && project.room_parameters.area && `${project.room_parameters.area} м²`}
                    </p>
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

export default ProjectsPage;