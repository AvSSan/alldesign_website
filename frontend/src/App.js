import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { 
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import axios from 'axios';
import MainPage from './components/mainpage/MainPage';
import ProjectsPage from './components/ProjectsPage';
import ProjectCardWrapper from './components/ProjectCardWrapper';
import BriefInfo from './components/mainpage/BriefInfo';
import ProjectCarousel from './components/mainpage/ProjectsCarousel';
import BeforeAfter from './components/mainpage/BeforeAfter';


const serverURL = "http://loshga99.beget.tech/";

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/projects" element={<ProjectsPage/>}/>
        <Route path="/project/:id" element={<ProjectCardWrapper />} />
        <Route path="/testingroom" element={<BeforeAfter />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
