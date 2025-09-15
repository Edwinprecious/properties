import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { Buy } from "./pages/Buy"
// import BuyNavbar from './pages/BuyNavbar';


// import './styles.css';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<Buy />} />
        {/* <Route path="/buyNavbar" element={<BuyNavbar />} /> */}
      </Routes>
      {/* <Footer /> */}
    </Router>

    </>
  )
  
}

export default App
