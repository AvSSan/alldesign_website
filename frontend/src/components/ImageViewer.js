import React, { useState, useCallback } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import styles from '../styles/ImageViewerComponent.module.css';

export default function ImageViewerComponent({ urls }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const images = urls.map((url) => ({ src: url })); 

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
          src={images[0].src}
          onClick={() => openImageViewer(0)}
          className={styles.mainImage}
          alt=""
        />
      )}
      <div className={styles.thumbnailContainer}>
        {images.slice(1).map((image, index) => (
          <div className={styles.thumbnailWrapper} key={index}>
            <img
              src={image.src}
              onClick={() => openImageViewer(index + 1)}
              className={styles.thumbnailImage}
              alt=""
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
          plugins={[Captions]}
        />
      )}
    </div>
  );
}
