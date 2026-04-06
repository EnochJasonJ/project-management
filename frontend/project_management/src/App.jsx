import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './views/LoginPage'
import LandingPage from './views/LandingPage'
import ProjectsPage from './views/ProjectsPage'
import PrivateRoute from './components/PrivateRoute'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/projects' element={
          <PrivateRoute>
            <ProjectsPage />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
