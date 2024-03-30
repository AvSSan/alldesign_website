import styles from '../styles/slide.module.css';

export default function Slide(props) {
    return(
        <div className={styles.whole_slide}>
            <div className={styles.img_slide}>
                <img src={props.image} alt="Logo" style={{height: "100vh", width: "100vw", objectFit: "cover", filter: "brightness(0.6)"}}/>
            </div>
            <div className={styles.text_slide}>
                <div className={styles.htext}>{props.htext}</div>
                <div className={styles.text}>{props.text}</div>
            </div>
        </div>
    )
}

