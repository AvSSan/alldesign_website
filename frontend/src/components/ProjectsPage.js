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
            images: [],
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
        const { projectId } = this.props;
        axios.get(`http://loshga99.beget.tech/api/projects/`)
            .then(response => {
                const projects = response.data;
                this.setState({ projects: projects, error: null });
            })
            .catch(error => {
                this.setState({ error: error });
            });
    }

    render() {
        const { error, projects, images } = this.state;

        if (error) {
            return <div className={styles.error}>Error: {error.message}</div>;
        }

        if (!projects) {
            return <div className={styles.loading}>Загрузка...</div>;
        }

        return (
            <div>
                <ToMain />
                <div className={styles.container}>
                    <div className={styles.gridContainer}>
                      {this.state.projects.map((item, index) => (
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
        );
    }
}

export default ProjectsPage;
