import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import QuotePage from './QuotePage'
import './index.css'

const path = window.location.pathname.replace(/\/$/, '')
const Page = path === '/internal-quote' ? QuotePage : App

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>,
)