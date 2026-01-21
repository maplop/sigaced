import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext'
import { AllocationPhaseProvider } from './context/AllocationPhaseContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <AllocationPhaseProvider>
          <App />
        </AllocationPhaseProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
)
