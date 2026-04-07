import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../utils/auth'
import LoginForm from '../components/LoginForm'

function LoginPage() {
  const navigate = useNavigate()
  useEffect(() => {
    if (isAuthenticated()) navigate("/projects")
  }, [navigate])

  return (
    <div className="min-h-screen bg-enterprise-light flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Structural background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-enterprise-dark" />
      
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 bg-enterprise-dark text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded mb-4">
            Authorized Personnel Only
          </div>
          <h1 className="text-2xl font-bold text-enterprise-dark tracking-tighter">TASKFLOW SYSTEMS</h1>
        </div>
        
        <LoginForm />
        
        <p className="mt-8 text-center text-[10px] font-bold text-enterprise-muted uppercase tracking-widest italic">
          High-performance project orchestration
        </p>
      </div>

      <a
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-enterprise-muted hover:text-enterprise-dark font-bold uppercase text-[9px] tracking-widest transition-colors group"
      >
        <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
        Return to Portal
      </a>
    </div>
  )
}

export default LoginPage
