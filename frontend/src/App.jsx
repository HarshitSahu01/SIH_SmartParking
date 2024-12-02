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

      </Routes>
    </>
  )
}

export default App
