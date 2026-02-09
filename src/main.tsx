import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/base.css'
import './styles/layout.css'
import './components/Header.css'
import './components/SidePanel.css'
import './components/HeroPanel.css'
import './components/SwatchGrid.css'
import './components/ExportPanel.css'
import './components/ResultsPanel.css'
import './components/Toast.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
