import axios from 'axios';
import styles from '../styles/header.module.css';
import companyLogo from '../static_files/logo.png';
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

axios.defaults.baseURL = 'http://localhost:8000';

export default function Header() {
    const [color, setColor] = useState("rgba(0, 0, 0, 0)");
    const listenScrollEvent = event => {
        if (window.scrollY < 100) {
            setColor("rgba(0, 0, 0, 0)");
        } else {
            setColor("rgb(0, 0, 0)");
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', listenScrollEvent);
        return () => window.removeEventListener('scroll', listenScrollEvent);
    }, []);

    return(
        <header className={styles.Header} style={{backgroundColor: color}}>
            <div className={styles.logo_list} >
                <img className={styles.logo} src={companyLogo} alt="Logo"/>
                <div className={styles.leftnav}>
                    <nav>
                        <ul>
                            <li><a href="#">О НАС</a></li>
                            <li><a href="#">РАБОТЫ</a></li>
                        </ul>
                    </nav>
                </div>
                <div className={styles.rightnav}>
                    <nav>
                        <ul>
                            <li><a href="#">УСЛУГИ</a></li>
                            <li><a href="#">КОНТАКТЫ</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )

}
