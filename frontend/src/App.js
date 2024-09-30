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
import Order from './components/Order';
import TestForm from './components/TestForm';
import UnderDevelopment from './components/UnderDevelopment';
import Privacy from './components/Privacy';
import Services from './components/Services';

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
        <Route path="/order" element={<Order />} />
        <Route path="/test" element={<TestForm />} />
        <Route path="/services" element={<Services />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
