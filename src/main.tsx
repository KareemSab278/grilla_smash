import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './Pages/App.tsx'
import { findNearestLocation, getDistanceToNearestLocationInKm } from './Logic/locationCheck.ts'

const [nearestLocation, distanceKm] = await Promise.all([
  findNearestLocation(),
  getDistanceToNearestLocationInKm(),
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App nearestLocation={nearestLocation} distanceKm={distanceKm} />
  </StrictMode>,
)
