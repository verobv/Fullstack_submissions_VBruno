import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { NotificationsContextProvider } from './contexts/NotificationsContext.jsx'
import { UserContextProvider } from './contexts/UserContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationsContextProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </NotificationsContextProvider>
  </QueryClientProvider>
)
