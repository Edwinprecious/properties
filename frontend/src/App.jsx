import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/NavBar';   // keep consistent casing
import Footer from './components/Footer';
import Signup from './pages/SignUp';
import Login from './pages/Login';
import { Buy } from "./pages/Buy";
import PropertiesPage from './pages/PropertiesPage';
import AdminDashboard from './pages/admin/Dashboard';
import ManageProperties from './pages/admin/ManageProperties';
import AddProperty from './pages/admin/AddProperty';
import EditProperty from './pages/admin/EditProperty';
import ManageInquiries from './pages/admin/ManageInquiries';
import AdminRoute from './components/AdminRoute';
// import ForgotPassword from './pages/ForgotPassword';
// import BuyNavbar from './pages/BuyNavbar';

function Layout({ children }) {
  const location = useLocation();

  // List of routes where you don't want navbar/footer
  const authRoutes = ["/signup", "/login", "/forgot-password"];

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
          <Route path="/properties" element={<PropertiesPage />} />
          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/properties" element={<AdminRoute><ManageProperties /></AdminRoute>} />
          <Route path="/admin/properties/add" element={<AdminRoute><AddProperty /></AdminRoute>} />
          <Route path="/admin/properties/edit/:id" element={<AdminRoute><EditProperty /></AdminRoute>} />
          <Route path="/admin/inquiries" element={<AdminRoute><ManageInquiries /></AdminRoute>} />
          {/* <Route path="/buyNavbar" element={<BuyNavbar />} /> */}
          {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
