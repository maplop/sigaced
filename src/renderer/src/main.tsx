import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext'
import { AssignmentPhaseProvider } from './context/AssignmentPhaseContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <AssignmentPhaseProvider>
          <App />
        </AssignmentPhaseProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
)
