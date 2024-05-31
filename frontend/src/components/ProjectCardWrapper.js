import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectCard from './ProjectCard';

function ProjectCardWrapper() {
  const { id } = useParams();

  return <ProjectCard projectId={id} />;
}

export default ProjectCardWrapper;