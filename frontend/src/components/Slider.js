import Slide from "./Slide";
import styles from "../styles/slider.module.css";
import tempImg from "../static_files/temp.png";
import tempImg2 from "../static_files/temp2.png";

export default function Slider(props) {
    return(
        <div className={styles.slider}>
            <div className={styles.slider_list}>
                <div>
                <Slide className={styles.slide1} image={tempImg} htext="ДИЗАЙН ИНТЕРЬЕРОВ В ХАБАРОВСКЕ" text={"Дизайнер-архитектор Александр Михеев. \nКомплексные услуги по созданию и реализации дизайн-проекта и ремонту в Хабаровске – от идеи до результата."}/>
                <Slide className={styles.slide2} image={tempImg2} htext="АВТОРСКИЙ НАДЗОР" text={"Экономьте время и нервы на ремонте – все проконтролируем за вас."}/>
           
                </div>
                <Slide className={styles.slide1} image={tempImg} htext="ДИЗАЙН ИНТЕРЬЕРОВ В ХАБАРОВСКЕ" text={"Дизайнер-архитектор Александр Михеев. \nКомплексные услуги по созданию и реализации дизайн-проекта и ремонту в Хабаровске – от идеи до результата."}/>
                <Slide className={styles.slide2} image={tempImg2} htext="АВТОРСКИЙ НАДЗОР" text={"Экономьте время и нервы на ремонте – все проконтролируем за вас."}/>
            </div>
            <div className={styles.commands}>
                <input type="radio" name="slide" id={styles.slideradio1} />
                <label for={styles.slideradio1}></label>
                <input type="radio" name="slide" id={styles.slideradio2} />
                <label for={styles.slideradio2}></label>
            </div>
        </div>
    )
}