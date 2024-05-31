import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import MainPage from './components/MainPage';
import Testimonials from './components/Testimonials';
import ProjectsPage from './components/ProjectsPage';
import ProjectCardWrapper from './components/ProjectCardWrapper';


const serverURL = "http://loshga99.beget.tech/";

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/testimonials" element={<Testimonials/>}/>
        <Route path="/projects" element={<ProjectsPage/>}/>
        <Route path="/project/:id" element={<ProjectCardWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
