import './App.css'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import DropPin from './Pages/DropPin'
import Map from './Pages/Map'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/maps" element={<Map />} />
        <Route path="/drop-pin" element={<DropPin />} />

      </Routes>
    </>
  )
}

export default App
