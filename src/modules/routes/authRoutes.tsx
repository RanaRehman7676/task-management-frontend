import { Routes, Route, Navigate } from 'react-router-dom'
import LoginForm from '../auth/LoginForm'
import RegisterForm from '../auth/RegisterForm'
import { useUser } from '../../context/AuthContext';



function AuthRoutes() {
  const { isAuthenticated } = useUser();
  
  // Redirect to task management if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/task-management" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginForm/>} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="" element={<Navigate to="/auth/login" replace />} />
      
      {/* Redirect any unmatched auth routes to login */}
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  )
}

export default AuthRoutes