
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CalendarProvider } from './context/CalendarContext'

// Global styles
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CalendarProvider>
      <App />
    </CalendarProvider>
  </React.StrictMode>
)
