import { BrowserRouter } from 'react-router-dom'
import RoutesComponent from './modules/routes/routes'
import { TaskProvider } from './context/TaskContext'
import { Toaster } from 'sonner'
import { UserProvider } from './context/AuthContext'

function App() {
  return (
    <TaskProvider>
      <UserProvider>
      <BrowserRouter>
        <RoutesComponent/>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
      </UserProvider>
    </TaskProvider>
  )
}

export default App