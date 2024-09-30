import { useState, useEffect } from 'react';
import companyLogo from '../../static_files/logo.png';
import BlackLogo from './BlackLogo';
import Slider from './Slider';
import AboutUs from './AboutUs';
import Testimonials from './Testimonials';
import styles from '../../styles/header.module.css';
import styles2 from '../../styles/MainPage.module.css';
import Contacts from './Contacts';
import Filler from './Filler';
import ProjectCarousel from './ProjectsCarousel';
import Benefits from './Benefits';
import BeforeAfterWhole from './BeforeAfterWhole';
import WorkStages from './WorkStages';
import ContactOverlay from './ContactOverlay';
import Partners from './Partners';



export default function MainPage() {
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

    return (
        <div>
            <header className={styles.Header} style={{backgroundColor: color}}>
                <div className={styles.logo_list} >
                    <img className={styles.logo} src={companyLogo} alt="Logo" style={{width: logoWidth, height: logoHeight, top: logoTop + "%"}}/>
                    <div className={styles.leftnav}>
                        <nav>
                            <ul>
                                <li><a href="/projects/">РАБОТЫ</a></li>
                                <li style={{whiteSpace: "nowrap"}}><a href="#aboutus">О НАС</a></li>   
                            </ul>
                        </nav>
                    </div>
                    <div className={styles.rightnav}>
                        <nav>
                            <ul>
                                <li><a href="/services">УСЛУГИ</a></li>
                                <li><a href="#contacts">КОНТАКТЫ</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
            <Slider />
            <Filler />
            <BlackLogo />
            <div id="aboutus">
                <AboutUs />
            </div>
            <div>
                <ProjectCarousel />
            </div>
            <div>
                <Benefits />
            </div>
            <div>
                <BeforeAfterWhole />
            </div>
            <div className={styles2.workstages}>
                <WorkStages />
            </div>
            <div id="testimonials">
                <Testimonials />
            </div>
            <div className={styles2.partners}>
                <Partners />
            </div>
            <div>
                <ContactOverlay />
            </div>
            <div id="contacts">
                <Contacts />
            </div>
        </div>
    );
}
