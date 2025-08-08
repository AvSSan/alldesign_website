import React, { useState, useEffect, useRef } from 'react';

const PannellumImage = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    console.log('Загрузка панорамы с URL:', url);
    setIsLoading(true);
    setError(null);
  }, [url]);

  const onIframeLoad = () => {
    console.log('iframe загружен');
    setIsLoading(false);
    setLoaded(true);
  };

  const onIframeError = (e) => {
    console.error('Ошибка загрузки iframe:', e);
    setError('Не удалось загрузить панораму');
    setIsLoading(false);
  };

  const iframeContent = `
    <!DOCTYPE HTML>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Панорама</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"/>
      <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
      <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        #panorama { width: 100%; height: 100vh; }
        .error-message { 
          position: absolute; 
          top: 50%; 
          left: 50%; 
          transform: translate(-50%, -50%);
          padding: 20px;
          background: rgba(0,0,0,0.7);
          color: white;
          border-radius: 8px;
          text-align: center;
        }
        .loading-spinner {
          position: absolute;
          top: 50%; 
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #000;
          border-radius: 50%;
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      </style>
    </head>
    <body>
      <div id="panorama"></div>
      <div id="loading" class="loading-spinner"></div>
      
      <script>
        window.addEventListener('load', function() {
          try {
            const isMobile = window.innerWidth <= 768;
            const panoramaImage = new Image();
            panoramaImage.crossOrigin = "Anonymous";
            
            panoramaImage.onload = function() {
              document.getElementById('loading').style.display = 'none';
              
              // Разные настройки для мобильной и десктопной версии
              const viewer = pannellum.viewer('panorama', {
                type: 'equirectangular',
                panorama: '${url}',
                autoLoad: true,
                showZoomCtrl: true,
                showFullscreenCtrl: true,
                hfov: isMobile ? 90 : 100,
                maxHfov: 120,
                friction: isMobile ? 0.4 : 0.15,
                touchPanSpeedCoefficient: 0.5,
                autoRotate: -2,
                compass: false
              });
              
              viewer.on('load', function() {
                window.parent.postMessage('pannellum_loaded', '*');
              });
              
              viewer.on('error', function(err) {
                console.error('Ошибка панорамы:', err);
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = 'Не удалось загрузить панораму';
                document.body.appendChild(errorDiv);
                document.getElementById('loading').style.display = 'none';
                window.parent.postMessage('pannellum_error', '*');
              });
            };
            
            panoramaImage.onerror = function() {
              const errorDiv = document.createElement('div');
              errorDiv.className = 'error-message';
              errorDiv.textContent = 'Не удалось загрузить изображение панорамы';
              document.body.appendChild(errorDiv);
              document.getElementById('loading').style.display = 'none';
              window.parent.postMessage('pannellum_error', '*');
            };
            
            panoramaImage.src = '${url}';
          } catch (e) {
            console.error('Ошибка при инициализации панорамы:', e);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'Произошла ошибка при загрузке панорамы';
            document.body.appendChild(errorDiv);
            document.getElementById('loading').style.display = 'none';
            window.parent.postMessage('pannellum_error', '*');
          }
        });
      </script>
    </body>
    </html>
  `;

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'pannellum_loaded') {
        setIsLoading(false);
        setLoaded(true);
      } else if (event.data === 'pannellum_error') {
        setError('Ошибка при загрузке панорамы');
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        background: '#f8f8f8', 
        borderRadius: '8px',
        color: '#cc0000'
      }}>
        <div>Ошибка: {error}</div>
        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              background: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px' }}>
      {isLoading && !loaded && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(245, 245, 245, 0.7)',
          zIndex: 5
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #000',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 2s linear infinite',
              margin: '0 auto 10px auto'
            }} />
            <div>Загрузка панорамы...</div>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        srcDoc={iframeContent}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
        sandbox="allow-scripts allow-same-origin allow-fullscreen"
        onLoad={onIframeLoad}
        onError={onIframeError}
        title="Панорама"
        allowFullScreen
      />
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
};

export default PannellumImage;