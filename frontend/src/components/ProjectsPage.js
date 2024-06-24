import React from 'react';
import axios from 'axios';
import styles from '../styles/ProjectsPage.module.css';
import ToMain from './ToMain';

class ProjectsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: null,
            error: null,
            backgroundImage: '',
        };
    }

    componentDidMount() {
        this.fetchProject();
    }

    componentDidUpdate(prevProps) {
        if (this.props.projectId !== prevProps.projectId) {
            this.fetchProject();
        }
    }

    fetchProject() {
        axios.get(`https://alldesignkhv.store/api/projects/`)
            .then(response => {
                const projects = response.data;
                const backgroundImage = projects.length > 0 ? projects[0].images[0].image : '';
                this.setState({ projects, error: null, backgroundImage });
            })
            .catch(error => {
                this.setState({ error });
            });
    }

    render() {
        const { error, projects, backgroundImage } = this.state;

        if (error) {
            return <div className={styles.error}>Error: {error.message}</div>;
        }

        if (!projects) {
            return <div className={styles.loading}>Загрузка...</div>;
        }

        return (
            <div className={styles.pageWrapper} style={{backgroundImage: `url(${backgroundImage})`}}>
                <div className={styles.overlay}>
                    <ToMain />
                    <div className={styles.container}>
                        <div className={styles.gridContainer}>
                            {projects.map((item, index) => (
                                <a key={index} href={`/project/${item.id}`} className={styles.card}>
                                    <div className={styles.cardImageContainer}>
                                        <img src={item.images[0].image} alt={item.title} className={styles.cardImage} />
                                    </div>
                                    <div className={styles.cardContent}>
                                        <h4>{item.location}</h4>
                                        <h3 className={styles.cardTitle}>{item.title}</h3>
                                        <p className={styles.cardText}>Нажмите для просмотра</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProjectsPage;