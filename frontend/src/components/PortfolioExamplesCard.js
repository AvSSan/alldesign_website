import styles from '../styles/portfolio_examples_card.module.css';
import ImageCarousel from './ImageCarousel';
import tempImg from '../static_files/temp.png';
import tempImg2 from '../static_files/temp2.png';
import tempImg3 from '../static_files/temp3.png';

export default function PortfolioExamplesCard(props) {
    return(
        <div className={styles.portfolio_examples_card}>
            <img className={styles.image} src={props.image} alt="First slide"/>
            <div className={styles.text}>
                <div className={styles.description}>
                    <div className={styles.place}>
                        <div classname={styles.placeborder}>
                            <span>{props.place}</span>
                        </div>
                    </div>
                    <div className={styles.title}>
                        <h3>
                            {props.title}
                        </h3>
                    </div>
                    <div className={styles.task}>
                        <p>
                            Задача: создать запоминающийся, эксклюзивный интерьер с яркими деталями под конкретный бюджет. Для этого нужно разделить тесное пространство на 4 блока, в которых грамотно распределить
                            всё необходимое
                        </p>
                    </div>
                </div>
                <div className={styles.houseprops}>
                    <p>
                    Площадь: 95 м²
Количество жилых комнат: 3
Количество членов семьи: 2
                    </p>
                </div>
            </div>
        </div>
    )
}