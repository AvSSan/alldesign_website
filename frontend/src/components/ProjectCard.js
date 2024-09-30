import React from 'react';
import axios from 'axios';
import styles from '../styles/ProjectCard.module.css';
import PannellumImage from './PannellumImage';
import ImageViewerComponent from './ImageViewer';
import ToMain from './ToMain';

class ProjectCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: null,
            error: null,
            images: [],
            flatParams: {
                "area": 'Площадь',
                'rooms': 'Количество комнат',
                'family': 'Количество членов семьи',
            },
            showPanorama: false,
            currentPanorama: null,
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
        axios.get(`https://alldesignkhv.store/api/projects/${projectId}/`)
            .then(response => {
                const project = response.data;
                const images = project.images.map(image => image.image);
                this.setState({ project, images, error: null });
            })
            .catch(error => {
                this.setState({ error });
            });
    }

    handlePanoramaClick(panorama) {
        this.setState({ showPanorama: true, currentPanorama: panorama });
    }

    closePanorama() {
        this.setState({ showPanorama: false, currentPanorama: null });
    }

    render() {
        const { error, project, images, showPanorama, currentPanorama } = this.state;

        if (error) {
            return <div className={styles.error}>Error: {error.message}</div>;
        }

        if (!project) {
            return <div className={styles.loading}>Загрузка...</div>;
        }

        return (
            <div>
                <ToMain />
                <div className={styles.projectCard}>
                <div className={styles.leftPane}>
                    <ImageViewerComponent urls={images} />
                </div>
                <div className={styles.rightPane}>
                    <h2 className={styles.projectTitle}>{project.title}</h2>
                    <p className={styles.projectLocation}> {project.location}</p>
                    <p className={styles.projectDescription}><strong>Описание:</strong> {project.description}</p>
                    <p className={styles.projectRoomParameters}><strong>Параметры:</strong></p>
                    <ul>
                        {Object.entries(project.room_parameters).map(([key, value]) => (
                            <li key={key}>{this.state.flatParams[key]}: {key === 'area' ? value + ' м²' : value}</li>
                        ))}
                    </ul>
                    <div>
                        <p>
                            Панорамы:
                        </p>
                    </div>
                    <div className={styles.panoramaButtons}>
                        {project.panoramas.map((panorama, index) => (
                            <button  className={styles.button} key={index} onClick={() => this.handlePanoramaClick(panorama)}>
                                {panorama.name}
                            </button>
                        ))}
                    </div>
                </div>
                {showPanorama && currentPanorama && (
                    <div className={styles.panoramaModal} onClick={() => this.closePanorama()}>
                        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <div className={styles.pannellumContainer}>
                                <PannellumImage url={currentPanorama.image} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </div>

        );
    }
}

export default ProjectCard;
