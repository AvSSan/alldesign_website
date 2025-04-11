import React, { useState, useCallback, useRef, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { ChevronLeft, ChevronRight, ZoomIn, Maximize, Info } from 'lucide-react';
import styles from '../styles/ImageViewerComponent.module.css';

export default function ImageViewerComponent({ urls }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 50; // Минимальное расстояние свайпа для переключения
  const containerRef = useRef(null);
  
  const images = urls.map((url) => ({ 
    src: url,
    alt: "Изображение интерьера"
  }));
  
  const mainImageIndex = activeIndex > 0 && activeIndex < images.length ? activeIndex : 0;

  useEffect(() => {
    // Определяем, является ли устройство сенсорным
    const detectTouchDevice = () => {
      const isTouchCapable = 'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        navigator.msMaxTouchPoints > 0;
      
      setIsTouchDevice(isTouchCapable && window.innerWidth <= 1024);
    };
    
    detectTouchDevice();
    window.addEventListener('resize', detectTouchDevice);
    
    return () => {
      window.removeEventListener('resize', detectTouchDevice);
    };
  }, []);

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };
  
  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
  };
  
  const handleNextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };
  
  const handlePrevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  // Обработчики для свайпов на сенсорных устройствах
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    const swipeDistance = touchEndX.current - touchStartX.current;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Свайп вправо - предыдущее изображение
        handlePrevImage();
      } else {
        // Свайп влево - следующее изображение
        handleNextImage();
      }
    }
    
    // Сбрасываем значения
    touchStartX.current = 0;
    touchEndX.current = 0;
  };
  
  // Динамические классы CSS для анимации свайпа
  const getSwipeIndicatorClass = () => {
    if (!isTouchDevice || images.length <= 1) return '';
    return styles.swipeIndicator;
  };

  return (
    <div className={styles.imageViewerContainer}>
      <div 
        ref={containerRef}
        className={`${styles.mainImageContainer} ${getSwipeIndicatorClass()}`}
        onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
        onMouseLeave={() => !isTouchDevice && setIsHovered(false)}
        onTouchStart={isTouchDevice ? handleTouchStart : undefined}
        onTouchMove={isTouchDevice ? handleTouchMove : undefined}
        onTouchEnd={isTouchDevice ? handleTouchEnd : undefined}
      >
        {images.length > 0 && (
          <>
            <img
              src={images[mainImageIndex].src}
              onClick={() => openImageViewer(mainImageIndex)}
              className={styles.mainImage}
              alt={images[mainImageIndex].alt}
              loading="lazy"
              draggable={false} // Предотвращаем стандартное перетаскивание изображения
            />
            
            {isHovered && !isTouchDevice && (
              <>
                <div className={styles.imageOverlay}>
                  <button 
                    className={`${styles.navButton} ${styles.zoomButton}`}
                    onClick={() => openImageViewer(mainImageIndex)}
                    aria-label="Увеличить"
                  >
                    <ZoomIn size={24} />
                  </button>
                  
                  <button 
                    className={`${styles.navButton} ${styles.fullscreenButton}`}
                    onClick={() => openImageViewer(mainImageIndex)}
                    aria-label="Полный экран"
                  >
                    <Maximize size={24} />
                  </button>
                </div>
                
                {images.length > 1 && (
                  <>
                    <button 
                      className={`${styles.navButton} ${styles.prevButton}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                      aria-label="Предыдущее изображение"
                    >
                      <ChevronLeft size={30} />
                    </button>
                    
                    <button 
                      className={`${styles.navButton} ${styles.nextButton}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      aria-label="Следующее изображение"
                    >
                      <ChevronRight size={30} />
                    </button>
                  </>
                )}
              </>
            )}
            
            {/* Индикатор свайпа для сенсорных устройств */}
            {isTouchDevice && images.length > 1 && (
              <div className={styles.swipeHint}>
                <div className={styles.swipeHintContent}>
                  <ChevronLeft size={20} />
                  <span>Свайп</span>
                  <ChevronRight size={20} />
                </div>
              </div>
            )}
            
            {images.length > 1 && (
              <div className={styles.dotsContainer}>
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${index === mainImageIndex ? styles.activeDot : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThumbnailClick(index);
                    }}
                    aria-label={`Изображение ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      <div className={styles.thumbnailContainer}>
        {images.map((image, index) => (
          <div 
            className={`${styles.thumbnailWrapper} ${index === mainImageIndex ? styles.activeThumbnail : ''}`} 
            key={index}
            onClick={() => handleThumbnailClick(index)}
          >
            <img
              src={image.src}
              className={styles.thumbnailImage}
              alt={`Миниатюра ${index + 1}`}
              loading="lazy"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {isViewerOpen && (
        <Lightbox
          slides={images}
          open={isViewerOpen}
          index={currentImage}
          close={closeImageViewer}
          plugins={[Captions, Zoom, Fullscreen, Thumbnails, Slideshow]}
          animation={{ fade: 300 }}
          carousel={{ finite: false, preload: 3 }}
          zoom={{ maxZoomPixelRatio: 5, wheelZoomDistanceFactor: 300 }}
          thumbnails={{ width: 120, height: 80, gap: 12, position: "bottom" }}
          slideshow={{ autoplay: false, delay: 3000 }}
          styles={{ 
            container: { backgroundColor: "rgba(0, 0, 0, .9)" },
            thumbnail: { border: "2px solid transparent", borderRadius: "4px" },
            thumbnailsTrack: { padding: "12px 0" },
            thumbnailsContainer: { backgroundColor: "rgba(0, 0, 0, .3)" }
          }}
          render={{
            iconNext: () => <ChevronRight size={30} />,
            iconPrev: () => <ChevronLeft size={30} />,
            iconZoomIn: () => <ZoomIn size={24} />,
            iconInfo: () => <Info size={24} />
          }}
        />
      )}
    </div>
  );
}
