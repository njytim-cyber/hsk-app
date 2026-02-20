import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ProgressProvider } from './contexts/ProgressContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { AudioProvider } from './contexts/AudioContext'
import './index.css'
import './styles/animations.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <ProgressProvider>
          <AudioProvider>
            <App />
          </AudioProvider>
        </ProgressProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>,
)


