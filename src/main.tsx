import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './Pages/App.tsx'
import { findNearestLocation } from './Logic/locationCheck.ts'
await findNearestLocation()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
