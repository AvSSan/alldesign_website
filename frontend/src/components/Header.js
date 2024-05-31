import styles from '../styles/header.module.css';
import companyLogo from '../static_files/logo.png';
import { useState, useEffect } from 'react';


export default function Header({ scrollToPortfolio }) {
    const [color, setColor] = useState("rgba(0, 0, 0, 0)");
    const [logoWidth, setLogoWidth] = useState(150);
    const [logoHeight, setLogoHeight] = useState(150);
    const [logoTop, setLogoTop] = useState(5);

    const listenScrollEvent = event => {
        if (window.scrollY < 100) {
            setColor("rgba(0, 0, 0, 0)");
            setLogoWidth(150);
            setLogoHeight(150);
            setLogoTop(5);
        } else {
            setColor("rgb(0, 0, 0)");
            setLogoWidth(50);
            setLogoHeight(50);
            setLogoTop(0);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', listenScrollEvent);
        return () => window.removeEventListener('scroll', listenScrollEvent);
    }, []);

    return(
        <header className={styles.Header} style={{backgroundColor: color}}>
            <div className={styles.logo_list} >
                <img className={styles.logo} src={companyLogo} alt="Logo" style={{width: logoWidth, height: logoHeight, top: logoTop + "%"}}/>
                <div className={styles.leftnav}>
                    <nav>
                        <ul>
                            <li><a href="/projects/">РАБОТЫ</a></li>
                            <li style={{whiteSpace: "nowrap"}}><a href="#">О НАС</a></li>   
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
