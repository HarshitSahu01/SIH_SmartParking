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
import LoginPage from './Admin/Login'
import RegisterPage from './Admin/Register'
import From from './Admin/Form'
import Test from './Admin/Test'
import Users from './Pages/Userpage'
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
        <Route path="/Admin/login" element={<LoginPage />} />
        <Route path="/Admin/register" element={<RegisterPage />} />
        <Route path="/Admin/form" element={<From />} />
        <Route path="/Admin/test" element={<Test />} />
        <Route path="/users" element={<Users />} />
        <Route path="/Admin/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}
export default App;

