import "./assets/main.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { HashRouter, BrowserRouter } from "react-router-dom"
import { AuthContextProvider } from "./context/AuthContext"
import { AllocationPhaseProvider } from "./context/AllocationPhaseContext"

const Router = import.meta.env.MODE === "development" ? BrowserRouter : HashRouter

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <AuthContextProvider>
        <AllocationPhaseProvider>
          <App />
        </AllocationPhaseProvider>
      </AuthContextProvider>
    </Router>
  </StrictMode>
)
