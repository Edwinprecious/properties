import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Signup from './pages/SignUp';
import Login from './pages/Login';
import { Buy } from "./pages/Buy";
import ForgotPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/RestPassword";

function Layout({ children }) {
  const location = useLocation();

  // List of routes where you don't want navbar/footer
  const authRoutes = ["/signup", "/login", "/forgot-password", "/reset-password"];

  const hideLayout = authRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
