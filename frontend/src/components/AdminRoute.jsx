// components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import Loadingspinner from './UI/LoadingSpinner';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');


  // if (loading) {
  //     return <LoadingSpinner />
  // }
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

export default AdminRoute;