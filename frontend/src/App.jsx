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
import PaymentForm from './Pages/PaymentForm'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51QU4k4I2jnvFyR8FLq9hxcshENbbGqcCIiW2Zr9qUjaS18fc1XKiY7ZbB6nDNmuGKDdUxama8JgzJ3xdwYSpDml500F6IxePo6');
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
        <Route
          path="/pay"
          element={
            <Elements stripe={stripePromise}>
              <PaymentForm />
            </Elements>
          }
        />
      </Routes>
    </>
  )
}

export default App
