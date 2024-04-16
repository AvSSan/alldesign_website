import styles from '../styles/portfolio_examples.module.css';
import PortfolioExamplesCard from './PortfolioExamplesCard';
import tempImg from '../static_files/temp.png';
import tempImg2 from '../static_files/temp2.png';
import tempImg3 from '../static_files/temp3.png';

export default function PortfolioExamples() {
    return(
        <div className={styles.portfolio_examples}>
            <div className={styles.portfolio_examples_header}>
                <h1 className={styles.portfolio_examples_header_title}>ПРИМЕРЫ РАБОТ</h1>
            </div>
            <div className={styles.portfolio_examples_list}>
                <PortfolioExamplesCard image={tempImg} place={'Квартира в ЖК "НОРДИК"'} title={'Эргономичный дизайн-проект для семьи с ребенком'} />
                <PortfolioExamplesCard image={tempImg2} place={'Квартира в ЖК "ТАЛАН"'}/>
                <PortfolioExamplesCard image={tempImg3} />
            </div>
        </div>
    )
}