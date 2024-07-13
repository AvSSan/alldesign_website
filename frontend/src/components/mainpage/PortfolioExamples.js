import styles from '../../styles/portfolio_examples.module.css';
import tempImg from '../../static_files/example1.png';
import tempImg2 from '../../static_files/example2.png';
import InteriorDesignCard from './InteriorDesignCard';

export default function PortfolioExamples() {
    return(
        <div className={styles.portfolio_examples}>
            <div className={styles.portfolio_examples_header}>
                <h1 className={styles.portfolio_examples_header_title}>НАШИ РАБОТЫ</h1>
                <h2 className={styles.portfolio_examples_header_title2}>Мы поможем реализовать ваши желания и создать интерьер мечты</h2>
            </div>
            <div className={styles.portfolio_examples_list}>
                <a href="/project/2">
                  <InteriorDesignCard
                    image={tempImg}
                    place="переулок Ленинградский"
                    title="Дизайн-проект 3-комнатной квартиры"
                    description="Сроки создания дизайн-проекта и завершения ремонта: май 2023 - конец августа 2023.
                    Пожелания заказчиков – спокойные серые оттенки и функциональность зон для экономии пространства.
                    Выполнен дизайн-проект кухни-гостиной, спальни и детской комнаты.
                    Зоны балкона вошли в состав полезной площади. На балконах организована компьютерная и постирочная зоны."
                    parameters={["Площадь: 70 м²", "Количество жилых комнат: 3", "Количество членов семьи: 4"]}
                  />
                </a>
                <a href="/project/3">
                  <InteriorDesignCard
                    image={tempImg2}
                    place="Квартира в ЖК 'НОРДИК'"
                    title="Эргономичный дизайн-проект для семьи с ребенком"
                    description="Выполнен в природных оттенках с обилием зелени. Также создан дизайн-проект детской комнаты. Оказываются услуги авторского надзора."
                    parameters={["Площадь: 79 м²", "Количество жилых комнат: 3", "Количество членов семьи: 3"]}
                  />
                </a>
                <a href="/projects/">
                  <button className={styles.button}>
                    Все проекты
                  </button>
                </a>
            </div>
        </div>
    )
}