import { Routes, Route, Navigate } from 'react-router-dom'
import TaskManagement from '../task-management/TaskManagement'
import LayoutComponent from '../Layout'
import { useUser } from '../../context/AuthContext'

function PrivateRoutes() {
  const { isAuthenticated } = useUser();
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return (
    <Routes>
      <Route path="/" element={<LayoutComponent />}>
        <Route index element={<TaskManagement />} />
        <Route path="task-management" element={<TaskManagement />} />
      </Route>
    </Routes>
  )
}

export default PrivateRoutes