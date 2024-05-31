import React, { useState, useCallback } from 'react';
import ImageViewer from 'react-simple-image-viewer';
import styles from '../styles/ImageViewerComponent.module.css';

export default function ImageViewerComponent({ urls }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const images = urls;

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <div className={styles.imageViewerContainer}>
      {images.length > 0 && (
        <img
          src={images[0]}
          onClick={() => openImageViewer(0)}
          className={styles.mainImage}
          alt=""
        />
      )}
      <div className={styles.thumbnailContainer}>
        {images.slice(1).map((src, index) => (
          <div className={styles.thumbnailWrapper} key={index}>
            <img
              src={src}
              onClick={() => openImageViewer(index + 1)}
              className={styles.thumbnailImage}
              alt=""
            />
          </div>
        ))}
      </div>

      {isViewerOpen && (
        <ImageViewer
          src={urls}
          currentIndex={currentImage}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
        />
      )}
    </div>
  );
}
