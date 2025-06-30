import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Dashboard from "./Dashboard.tsx";

document.documentElement.setAttribute('data-theme', 'dark');


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Dashboard/>
  </StrictMode>,
)
