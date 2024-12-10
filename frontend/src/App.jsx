import './App.css'
import {Routes, Route} from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import DropPin from './Pages/DropPin'
import Map from './Pages/Map'
import Swiper from './Pages/testSwiper'
import Search from './Pages/Search'
import TestingLandingPage from './Pages/TestingLandingPage'
import ParkingBox from './Pages/ParkingBox'
import ParkingOnMap from './Pages/ParkingOnmap'
import ParkingOncards from './Pages/ParkingOncards'
import LoginPage from './admin/Login'
import RegisterPage from './admin/Register'
import From from './admin/Form'
import Test from './Admin/Test'
import Dashboard from './Admin/Dashboard'

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
        <Route path="/admin/dashboard" element={<Dashboard />} />
    
      </Routes>
    </>
  )
}

export default App;

