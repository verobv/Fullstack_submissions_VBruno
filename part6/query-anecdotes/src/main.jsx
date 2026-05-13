import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationsContextProvider } from './components/NotificationsContext.jsx'
import App from './App.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationsContextProvider>
      <App />
    </NotificationsContextProvider>
  </QueryClientProvider>
)