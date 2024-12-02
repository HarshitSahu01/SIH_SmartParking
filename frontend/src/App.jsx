import './App.css'
import {Routes, Route} from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import DropPin from './Pages/DropPin'
import Map from './Pages/Map'
import Swiper from './Pages/testSwiper'
<<<<<<< HEAD
import TestingLandingPage from './Pages/TestingLandingPage'
=======
import ParkingBox from './Pages/ParkingBox'
>>>>>>> d90dff5cd4f231298503e2a9ce791786a4d6e009
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/maps" element={<Map />} />
        <Route path="/drop-pin" element={<DropPin />} />
        <Route path="/test" element={<Swiper />} />
<<<<<<< HEAD
        <Route path="/testlan" element={<TestingLandingPage />} />
=======
        <Route path="/parking-card" element={<ParkingBox />} />
>>>>>>> d90dff5cd4f231298503e2a9ce791786a4d6e009

      </Routes>
    </>
  )
}

export default App
