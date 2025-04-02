import React from 'react';
import axios from 'axios';
import styles from '../styles/ProjectCard.module.css';
import PannellumImage from './PannellumImage';
import ImageViewerComponent from './ImageViewer';
import Contacts from './mainpage/Contacts';
import { X } from 'lucide-react';
import UniversalHeader from './UniversalHeader';

class ProjectCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: null,
            error: null,
            loading: true,
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
            this.setState({ loading: true });
            this.fetchProject();
        }
    }

    fetchProject() {
        const { projectId } = this.props;
        axios.get(`https://alldesignkhv.store/api/projects/${projectId}/`)
            .then(response => {
                const project = response.data;
                const images = project.images.map(image => image.image);
                this.setState({ project, images, error: null, loading: false });
            })
            .catch(error => {
                this.setState({ error, loading: false });
                console.error('Ошибка при загрузке проекта:', error);
            });
    }

    handlePanoramaClick(panorama) {
        this.setState({ showPanorama: true, currentPanorama: panorama });
        document.body.style.overflow = 'hidden'; // Предотвращает прокрутку страницы при открытом модальном окне
    }

    closePanorama() {
        this.setState({ showPanorama: false, currentPanorama: null });
        document.body.style.overflow = ''; // Восстанавливает прокрутку страницы
    }

    renderParameters() {
        const { project } = this.state;
        
        if (!project.room_parameters || Object.keys(project.room_parameters).length === 0) {
            return null;
        }
        
        return (
            <>
                <h3 className={styles.sectionTitle}>Параметры</h3>
                <ul className={styles.parametersList}>
                    {Object.entries(project.room_parameters).map(([key, value]) => (
                        <li key={key} className={styles.parameterItem}>
                            <span className={styles.parameterLabel}>{this.state.flatParams[key] || key}:</span>
                            <span className={styles.parameterValue}>{key === 'area' ? `${value} м²` : value}</span>
                        </li>
                    ))}
                </ul>
            </>
        );
    }

    renderPanoramas() {
        const { project } = this.state;
        
        if (!project.panoramas || project.panoramas.length === 0) {
            return null;
        }
        
        return (
            <div className={styles.panoramasSection}>
                <h3 className={styles.sectionTitle}>Панорамы</h3>
                <div className={styles.panoramaButtons}>
                    {project.panoramas.map((panorama, index) => (
                        <button className={styles.panoramaButton} key={index} onClick={() => this.handlePanoramaClick(panorama)}>
                            {panorama.name}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    render() {
        const { error, project, images, showPanorama, currentPanorama, loading } = this.state;

        if (loading) {
            return (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>!</div>
                    <h2 className={styles.errorTitle}>Произошла ошибка</h2>
                    <p className={styles.errorMessage}>Не удалось загрузить проект. Пожалуйста, попробуйте позже.</p>
                    <a href="/projects" className={styles.backButton}>Вернуться к проектам</a>
                </div>
            );
        }

        if (!project) {
            return (
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>?</div>
                    <h2 className={styles.errorTitle}>Проект не найден</h2>
                    <p className={styles.errorMessage}>Запрашиваемый проект не существует или был удален.</p>
                    <a href="/projects" className={styles.backButton}>Вернуться к проектам</a>
                </div>
            );
        }

        const projectSchema = {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": project.title,
            "description": project.description || '',
            "image": images.length > 0 ? images[0] : '',
            "author": {
                "@type": "Person",
                "name": "All Design"
            }
        };

        return (
            <div className={styles.pageContainer}>
                <script type="application/ld+json">
                    {JSON.stringify(projectSchema)}
                </script>
                <UniversalHeader />
                <div className={styles.projectCard}>
                    <div className={styles.projectHeader}>
                        <h1 className={styles.projectTitle}>{project.title}</h1>
                        {project.location && <p className={styles.projectLocation}>{project.location}</p>}
                    </div>
                    
                    <div className={styles.projectContent}>
                        <div className={styles.leftPane}>
                            <ImageViewerComponent urls={images} />
                        </div>
                        
                        <div className={styles.rightPane}>
                            {project.description && (
                                <>
                                    <h3 className={styles.sectionTitle}>Описание</h3>
                                    <p className={styles.projectDescription}>{project.description}</p>
                                </>
                            )}
                            
                            {this.renderParameters()}
                            {this.renderPanoramas()}
                        </div>
                    </div>
                </div>
                
                {showPanorama && currentPanorama && (
                    <div className={styles.panoramaModal} onClick={() => this.closePanorama()}>
                        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <button className={styles.closeButton} onClick={() => this.closePanorama()}>
                                <X size={24} />
                            </button>
                            <h3 className={styles.panoramaTitle}>{currentPanorama.name}</h3>
                            <div className={styles.pannellumContainer}>
                                <PannellumImage url={currentPanorama.image} />
                            </div>
                        </div>
                    </div>
                )}
                
                <div id="contacts">
                    <Contacts />
                </div>
            </div>
        );
    }
}

export default ProjectCard;
