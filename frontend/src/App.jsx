import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Signup from './pages/SignUp';
import Login from './pages/Login';
import { Buy } from './pages/Buy.jsx';
import { Housebuy } from './pages/Housebuy.jsx';
import ListPage from './pages/Listpage/ListPage.jsx';


import Properties from './components/Properties';
import Filter from "./components/filter/Filter.jsx"; 




function Layout({ children }) {
  const location = useLocation();

  const authRoutes = ["/signup", "/login", "/forgot-password", "/Housebuy"];
  const hideLayout = authRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {/* {!hideLayout && <Footer />} */}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/HouseforSale" element={<Housebuy />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/listpage" element={<ListPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
