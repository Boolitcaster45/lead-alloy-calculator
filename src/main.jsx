import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LeadAlloyCalculator from './LeadAlloyCalculator.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LeadAlloyCalculator />
  </StrictMode>,
)
