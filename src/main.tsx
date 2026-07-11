import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './Pages/App.tsx'
import { NoCloseLocation } from './Pages/NoCloseLocation.tsx'
import { findNearestLocation } from './Logic/locationCheck.ts'

const nearestLocation = await findNearestLocation()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {nearestLocation ? <App nearestLocation={nearestLocation} /> : <NoCloseLocation />}
  </StrictMode>,
)
