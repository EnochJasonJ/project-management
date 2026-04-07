import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoginPage from './views/LoginPage'
import LandingPage from './views/LandingPage'
import ProjectsPage from './views/ProjectsPage'
import PrivateRoute from './components/PrivateRoute'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#273043',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)'
          },
          success: {
            iconTheme: {
              primary: '#48bb78',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f56565',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/projects' element={
          <PrivateRoute>
            <ProjectsPage />
          </PrivateRoute>
        } />
        {/* Alias for projects to fix "No routes matched" error */}
        <Route path="/dashboard" element={<Navigate to="/projects" replace />} />
        
        {/* Catch-all: Redirect to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
