import axios from 'axios';
import Header from './Header';
import Slider from './Slider';
import PortfolioExamples from './PortfolioExamples';

axios.defaults.baseURL = 'http://localhost:8000';

export default function MainPage() {
    return(
        <div>
            <Header/>
            <Slider />
            <PortfolioExamples />
            <p>fsdfffffffffffffffffffffffffffffffffffffffffffffffffffffffff</p>
            <p>fsdfffffffffffffffffffffffffffffffffffffffffffffffffffffffff</p>
            <p>fsdfffffffffffffffffffffffffffffffffffffffffffffffffffffffff</p>
            <p>fsdfffffffffffffffffffffffffffffffffffffffffffffffffffffffff</p>
            <p>fsdfffffffffffffffffffffffffffffffffffffffffffffffffffffffff</p> 
            <p>fsdfffffffffffffffffffffffffffffffffffffffffffffffffffffffff</p>                        
            <p>fsdfffffffffffffffffffffffffffffffffffffffffffffffffffffffff</p>
        </div>

    )

}
