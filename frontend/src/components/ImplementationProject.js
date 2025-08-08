import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/ImplementationProject.module.css';
import UniversalHeader from './UniversalHeader';
import Contacts from './mainpage/Contacts';
import { Play, ChevronLeft, ChevronRight, Check, Calendar, MapPin, SquareIcon, ZoomIn, Maximize } from 'lucide-react';
import { implementationService } from '../services/implementationService';
import LoadingSpinner from './LoadingSpinner';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

const ImplementationProject = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [stages, setStages] = useState([]);
  const [activeStage, setActiveStage] = useState(0);
  const [activeMedia, setActiveMedia] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const roadmapRef = useRef(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Определяем размер экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        // Получаем данные реализации
        const projectData = await implementationService.getImplementationById(id);
        setProject(projectData);

        // Получаем этапы реализации
        const stagesData = await implementationService.getImplementationStages(id);
        
        // Для каждого этапа получаем медиафайлы
        const stagesWithMedia = await Promise.all(
          stagesData.map(async (stage) => {
            const media = await implementationService.getStageMedia(stage.id);
            return { ...stage, media };
          })
        );

        setStages(stagesWithMedia);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке данных проекта');
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [id]);

  // Сбрасываем состояние видео при смене медиа или этапа
  useEffect(() => {
    setIsVideoPlaying(false);
  }, [activeStage, activeMedia]);

  useEffect(() => {
    if (roadmapRef.current && stages.length > 0) {
      const roadmapElement = roadmapRef.current;
      const activeElement = roadmapElement.querySelector(`.${styles.active}`);
      
      if (activeElement) {
        const roadmapRect = roadmapElement.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();
        
        if (activeRect.left < roadmapRect.left || activeRect.right > roadmapRect.right) {
          const scrollPosition = activeElement.offsetLeft - (roadmapRect.width / 2) + (activeRect.width / 2);
          roadmapElement.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [activeStage, stages]);

  const handleStageClick = (index) => {
    setActiveStage(index);
    setActiveMedia(0);
  };

  const handlePrevStage = () => {
    setActiveStage((prev) => (prev > 0 ? prev - 1 : stages.length - 1));
    setActiveMedia(0);
  };

  const handleNextStage = () => {
    setActiveStage((prev) => (prev < stages.length - 1 ? prev + 1 : 0));
    setActiveMedia(0);
  };

  const handlePrevMedia = () => {
    const currentStageMedia = stages[activeStage]?.media || [];
    setActiveMedia((prev) => (prev > 0 ? prev - 1 : currentStageMedia.length - 1));
  };

  const handleNextMedia = () => {
    const currentStageMedia = stages[activeStage]?.media || [];
    setActiveMedia((prev) => (prev < currentStageMedia.length - 1 ? prev + 1 : 0));
  };

  // Генерация URL превью для видео
  const getVideoThumbnailUrl = (videoUrl) => {
    if (videoUrl && videoUrl.includes('rutube.ru')) {
      let videoId = '';
      
      if (videoUrl.includes('/video/')) {
        videoId = videoUrl.split('/video/')[1].replace(/\/$/, '').split('/')[0];
      } else if (videoUrl.includes('/play/embed/')) {
        videoId = videoUrl.split('/play/embed/')[1].replace(/\/$/, '').split('/')[0];
      } else {
        const matches = videoUrl.match(/[a-zA-Z0-9]{32}/);
        if (matches && matches.length > 0) {
          videoId = matches[0];
        }
      }
      
      if (videoId) {
        return `https://pic.rutube.ru/video/${videoId}/thumbnail.jpg`;
      }
    }    
    return null;
  };

  const generateVideoEmbed = (videoUrl) => {
    if (!videoUrl) return null;
    
    try {
      // Rutube
      if (videoUrl.includes('rutube.ru')) {
        let videoId = '';
        
        if (videoUrl.includes('/video/')) {
          videoId = videoUrl.split('/video/')[1].replace(/\/$/, '').split('/')[0];
        } else if (videoUrl.includes('/play/embed/')) {
          videoId = videoUrl.split('/play/embed/')[1].replace(/\/$/, '').split('/')[0];
        } else {
          const matches = videoUrl.match(/[a-zA-Z0-9]{32}/);
          if (matches && matches.length > 0) {
            videoId = matches[0];
          }
        }
        
        if (videoId) {
          return `<iframe src="https://rutube.ru/play/embed/${videoId}" width="100%" height="100%" frameborder="0" allow="clipboard-write; autoplay; fullscreen" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>`;
        }
      }
      
      // Vimeo
      else if (videoUrl.includes('vimeo.com')) {
        let vimeoId = '';
        
        if (videoUrl.includes('player.vimeo.com/video/')) {
          vimeoId = videoUrl.split('player.vimeo.com/video/')[1].split('?')[0].split('/')[0];
        } else {
          vimeoId = videoUrl.split('vimeo.com/')[1].split('?')[0].split('/')[0];
        }
        if (vimeoId) {
          return `<iframe src="https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
        }
      }
      
      else if (videoUrl.includes('vk.com') || videoUrl.includes('vkvideo.ru')) {
        if (videoUrl.includes('vkvideo.ru/video-')) {
          const parts = videoUrl.split('video-')[1].split('_');
          const ownerId = parts[0];
          const id = parts[1];
          
          return `<iframe src="https://vkvideo.ru/video_ext.php?oid=-${ownerId}&id=${id}&hd=2&autoplay=1" width="100%" height="100%" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" frameborder="0" allowfullscreen></iframe>`;
        } 
        else if (videoUrl.includes('vk.com/video-')) {
          const parts = videoUrl.split('video-')[1].split('_');
          const groupId = parts[0];
          const id = parts[1];
          
          return `<iframe src="https://vkvideo.ru/video_ext.php?oid=-${groupId}&id=${id}&hd=2&autoplay=1" width="100%" height="100%" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" frameborder="0" allowfullscreen></iframe>`;
        } 
        else if (videoUrl.includes('vk.com/video')) {
          const parts = videoUrl.split('video')[1].split('_');
          const ownerId = parts[0];
          const id = parts[1];
          const prefix = ownerId.startsWith('-') ? '' : '-';
          return `<iframe src="https://vkvideo.ru/video_ext.php?oid=${prefix}${ownerId}&id=${id}&hd=2&autoplay=1" width="100%" height="100%" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" frameborder="0" allowfullscreen></iframe>`;
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  };
  
  const playVideo = () => {
    const embedCode = currentMedia.video_embed || generateVideoEmbed(currentMedia.video_url);
    
    if (embedCode) {
      const updatedMedia = {...currentMedia, video_embed: embedCode};
      const updatedStages = [...stages];
      updatedStages[activeStage].media[activeMedia] = updatedMedia;
      setStages(updatedStages);
      
      setIsVideoPlaying(true);
    } else {
      alert('Ошибка: не удалось загрузить видео. Формат видео не поддерживается или URL неверный.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      month: 'long',
      year: 'numeric'
    });
  };

  const openLightbox = (index = 0) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const getLightboxSlides = () => {
    if (!currentStage?.media || currentStage.media.length === 0) {
      return [];
    }

    return currentStage.media
      .filter(item => item.media_type === 'image')
      .map(item => ({
        src: item.file_url,
        alt: item.title,
        title: item.title,
        description: item.description || ''
      }));
  };

  if (loading) {
    return (
      <div>
        <UniversalHeader />
        <div className={styles.container}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div>
        <UniversalHeader />
        <div className={styles.container}>
          <div className={styles.error}>{error || 'Проект не найден'}</div>
        </div>
      </div>
    );
  }

  const currentStage = stages[activeStage] || {};
  const currentMedia = currentStage.media?.[activeMedia] || {};
  const lightboxSlides = getLightboxSlides();
  const currentImageIndex = currentMedia.media_type === 'image' 
    ? lightboxSlides.findIndex(slide => slide.src === currentMedia.file_url)
    : 0;
  
  const thumbnailUrl = currentMedia.thumbnail_url || 
                     (currentMedia.media_type === 'video' ? getVideoThumbnailUrl(currentMedia.video_url) : null);

  const completedStages = stages.filter(stage => stage.is_completed).length;
  const progressPercentage = stages.length > 0 ? (completedStages / stages.length) * 100 : 0;

  return (
    <div className={styles.pageWrapper}>
      <UniversalHeader />
      <div className={styles.heroSection} style={{ backgroundImage: `url(${project.main_image_url})` }}>
        <div className={styles.heroOverlay}>
          <div className={styles.container}>
            <h1 className={styles.projectTitle}>{project.title}</h1>
            <div className={styles.projectMeta}>
              <div className={styles.metaItem}>
                <MapPin size={isMobile ? 16 : 18} />
                <span>{project.location}</span>
              </div>
              {project.area && (
                <div className={styles.metaItem}>
                  <SquareIcon size={isMobile ? 16 : 18} />
                  <span>{project.area} м²</span>
                </div>
              )}
              <div className={styles.metaItem}>
                <Calendar size={isMobile ? 16 : 18} />
                <span>{formatDate(project.start_date)} - {project.end_date ? formatDate(project.end_date) : 'По настоящее время'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.projectDescription}>
          <p>{project.description}</p>
        </div>

        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progressPercentage}%` }} 
            />
          </div>
          <div className={styles.progressInfo}>
            <span>Выполнено: {completedStages} из {stages.length} этапов</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
        </div>

        <div className={styles.roadmapSection}>
          <h2 className={styles.sectionTitle}>Этапы проекта</h2>
          <div className={styles.roadmap} ref={roadmapRef}>
            {stages.map((stage, index) => (
              <div 
                key={stage.id} 
                className={`${styles.roadmapItem} ${index === activeStage ? styles.active : ''} ${stage.is_completed ? styles.completed : ''}`}
                onClick={() => handleStageClick(index)}
              >
                <div className={styles.roadmapPoint}>
                  {stage.is_completed && <Check size={isMobile ? 14 : 16} />}
                </div>
                <div className={styles.roadmapLine} />
                <div className={styles.roadmapContent}>
                  <h3 className={styles.roadmapTitle}>{stage.title}</h3>
                  <span className={styles.roadmapDate}>
                    {formatDate(stage.start_date)}
                    {stage.end_date && ` - ${formatDate(stage.end_date)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.stageDetailSection}>
          <div className={styles.stageNavigation}>
            <button onClick={handlePrevStage} className={styles.navButton}>
              <ChevronLeft size={isMobile ? 20 : 24} />
            </button>
            <div className={styles.stageInfo}>
              <h2 className={styles.stageTitle}>{currentStage.title}</h2>
              <p className={styles.stageDescription}>{currentStage.description}</p>
            </div>
            <button onClick={handleNextStage} className={styles.navButton}>
              <ChevronRight size={isMobile ? 20 : 24} />
            </button>
          </div>

          <div className={styles.mediaContainer}>
            {currentStage.media?.length > 0 ? (
              <>
                <div className={styles.mediaContent}>
                  {currentMedia.media_type === 'video' ? (
                    <div className={styles.videoWrapper}>
                      {isVideoPlaying && (currentMedia.video_embed || generateVideoEmbed(currentMedia.video_url)) ? (
                        <div className={styles.videoEmbed} dangerouslySetInnerHTML={{ 
                          __html: currentMedia.video_embed || generateVideoEmbed(currentMedia.video_url)
                        }} />
                      ) : (
                        <div 
                          className={styles.videoPreview}
                          onClick={playVideo}
                          style={{ 
                            backgroundImage: thumbnailUrl 
                              ? `url(${thumbnailUrl})` 
                              : 'none',
                            backgroundColor: !thumbnailUrl ? '#000' : 'transparent'
                          }}
                        >
                          {!thumbnailUrl && (
                            <div className={styles.noThumbnail}>Нет превью для видео</div>
                          )}
                          <div className={styles.playButtonWrapper}>
                            <Play className={styles.playButton} size={isMobile ? 32 : 48} />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={styles.imageWrapper}>
                      <img 
                        src={currentMedia.file_url} 
                        alt={currentMedia.title} 
                        className={styles.mediaImage}
                        loading="lazy"
                        onClick={() => openLightbox(currentImageIndex)}
                      />
                      <div className={styles.imageControls}>
                        <button 
                          className={styles.imageControlButton}
                          onClick={() => openLightbox(currentImageIndex)}
                          aria-label="Открыть на полный экран"
                        >
                          <Maximize size={isMobile ? 20 : 24} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.mediaInfo}>
                  <h3 className={styles.mediaTitle}>{currentMedia.title}</h3>
                  {currentMedia.description && (
                    <p className={styles.mediaDescription}>{currentMedia.description}</p>
                  )}
                </div>
                <div className={styles.mediaNavigation}>
                  <button 
                    onClick={handlePrevMedia} 
                    className={styles.mediaNavButton}
                    disabled={currentStage.media?.length <= 1}
                  >
                    <ChevronLeft size={isMobile ? 18 : 20} />
                  </button>
                  <div className={styles.mediaPagination}>
                    {currentStage.media?.map((_, index) => (
                      <div 
                        key={index} 
                        className={`${styles.paginationDot} ${index === activeMedia ? styles.active : ''}`}
                        onClick={() => setActiveMedia(index)}
                      />
                    ))}
                  </div>
                  <button 
                    onClick={handleNextMedia} 
                    className={styles.mediaNavButton}
                    disabled={currentStage.media?.length <= 1}
                  >
                    <ChevronRight size={isMobile ? 18 : 20} />
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.noMedia}>
                Нет медиафайлов для этого этапа
              </div>
            )}
          </div>
        </div>
      </div>
      <div id="contacts">
        <Contacts />
      </div>

      {isLightboxOpen && lightboxSlides.length > 0 && (
        <Lightbox
          slides={lightboxSlides}
          open={isLightboxOpen}
          index={lightboxIndex}
          close={() => setIsLightboxOpen(false)}
          plugins={[Captions, Zoom, Fullscreen, Thumbnails]}
          animation={{ fade: 300 }}
          carousel={{ finite: false, preload: 3 }}
          zoom={{ maxZoomPixelRatio: 5, wheelZoomDistanceFactor: 300 }}
          thumbnails={{ width: 120, height: 80, gap: 12, position: "bottom" }}
          styles={{ 
            container: { backgroundColor: "rgba(0, 0, 0, .9)" },
            thumbnail: { border: "2px solid transparent", borderRadius: "4px" },
            thumbnailsTrack: { padding: "12px 0" },
            thumbnailsContainer: { backgroundColor: "rgba(0, 0, 0, .3)" }
          }}
          render={{
            iconNext: () => <ChevronRight size={30} />,
            iconPrev: () => <ChevronLeft size={30} />,
            iconZoomIn: () => <ZoomIn size={24} />
          }}
        />
      )}
    </div>
  );
};

export default ImplementationProject; 