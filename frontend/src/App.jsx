import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/About';
import DropPin from './Pages/DropPin';
import Map from './Pages/Map';
import Swiper from './Pages/testSwiper';
import Search from './Pages/Search';
import TestingLandingPage from './Pages/TestingLandingPage';
import ParkingBox from './Pages/ParkingBox';
import ParkingOnMap from './Pages/ParkingOnmap';
import ParkingOncards from './Pages/ParkingOncards';
import LoginPage from './Admin/Login';
import RegisterPage from './Admin/Register';
import From from './Admin/Form';
import Test from './Admin/Test';  // Keep this import only once
import ContactPage from './Pages/ContactPage';
import Dashboard from './Admin/Dashboard';
import Transport from './Pages/Transport';
import LogisticsMap from './Pages/LogisticsMap';
import LogiCard from './Pages/LogiCard';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/maps" element={<Map />} />
        <Route path="/drop-pin" element={<DropPin />} />
        <Route path="/test" element={<Swiper />} />
        <Route path="/testlan" element={<TestingLandingPage />} />
        <Route path="/parking-card" element={<ParkingBox />} />
        <Route path="/search" element={<Search />} />
        <Route path="/parkings-maps" element={<ParkingOnMap />} />
        <Route path="/parkings-cards" element={<ParkingOncards />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/register" element={<RegisterPage />} />
        <Route path="/admin/form" element={<From />} />
        <Route path="/admin/test" element={<Test />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path ="/transport" element = {<Transport/>}/>
        <Route path ="/logistics" element = {<LogisticsMap/>}/>
        <Route path ="/logicard" element = {<LogiCard/>}/>
      </Routes>
    </>
  );
}

export default App;
