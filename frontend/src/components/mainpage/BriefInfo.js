import React, { useEffect, useState } from 'react';
import styles from '../../styles/BriefInfo.module.css';
import Typewriter from 'typewriter-effect';

export default function BriefInfo({title, description, type}) {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        // Добавляем небольшую задержку для более заметного эффекта появления
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);
        
        return () => clearTimeout(timer);
    }, []);
    
    const renderContent = () => {
        const contentClass = isVisible ? styles.visible : '';
        
        if (type === 'true') {
            return (
                <div className={`${styles.card} ${contentClass}`}>
                    <h2 className={styles.title}>{title}</h2>
                    <div className={styles.typewriterContainer}>
                        <Typewriter
                            options={{
                                strings: "ДИЗАЙН ИНТЕРЬЕРА ДЛЯ ДОМА И БИЗНЕСА",
                                autoStart: true,
                                loop: true,
                                delay: 60,
                                deleteSpeed: 40,
                                pauseFor: 2800,
                                wrapperClassName: styles.typewriterText
                            }}
                        />
                    </div>
                    <p className={styles.description}>
                        {description.split(' ').map((word, index) => (
                            <span 
                                key={index} 
                                className={styles.word}
                                style={{ 
                                    animationDelay: `${0.03 * index}s`,
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateY(0)' : 'translateY(10px)'
                                }}
                            >
                                {word}&nbsp;
                            </span>
                        ))}
                    </p>
                    <a href='/order'>
                        <button className={styles.button}>
                            <span>УЗНАТЬ</span>
                        </button>
                    </a>
                </div>
            );
        } else {
            return (
                <div className={`${styles.card} ${contentClass}`}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.description}>
                        {description.split(' ').map((word, index) => (
                            <span 
                                key={index} 
                                className={styles.word}
                                style={{ 
                                    animationDelay: `${0.03 * index}s`,
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateY(0)' : 'translateY(10px)'
                                }}
                            >
                                {word}&nbsp;
                            </span>
                        ))}
                    </p>
                    <a href='/order'>
                        <button className={styles.button}>
                            <span>УЗНАТЬ</span>
                        </button>
                    </a>
                </div>
            );
        }
    };
    
    return (
        <div className={styles.wrapper}>
            {renderContent()}
        </div>
    );
};

