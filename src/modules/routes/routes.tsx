import { Navigate, Route, Routes } from 'react-router-dom'
import AuthRoutes from './authRoutes'
import PrivateRoutes from './privateRoutes'
import { useUser } from '../../context/AuthContext'

function RoutesComponent() {
  const { user,isAuthenticated, isLoading } = useUser()
  console.log(user,isAuthenticated,"fghjkl")
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  return (
    <Routes>
       <Route 
        path="/auth/*" 
        element={
          isAuthenticated ? <Navigate to="/task-management" replace /> : <AuthRoutes />
        } 
      />
      
      {/* Protected routes - only accessible when authenticated */}
      <Route 
        path="/*" 
        element={
          isAuthenticated ? <PrivateRoutes /> : <Navigate to="/auth/login" replace />
        }
      />
    </Routes>
  )
}

export default RoutesComponent