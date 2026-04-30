import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import './styles/theme.css'
import './styles/shared.css'
import './styles/nav.css'
import './styles/layout.css'
import './styles/calculator.css'
import './styles/dashboard.css'
import './styles/about.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
