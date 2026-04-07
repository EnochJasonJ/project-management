import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../utils/auth'
import LoginForm from '../components/LoginForm'
import { supabase } from '../utils/supabaseClient'
import axios from 'axios'
import { toast } from 'react-hot-toast'

function LoginPage() {
  const navigate = useNavigate()
  const [isSyncing, setIsSyncing] = useState(false)
  const hasSynced = useRef(false)

  useEffect(() => {
    // 1. If we already have a TASKFLOW token, just go to projects
    if (isAuthenticated()) {
      navigate("/projects")
      return
    }

    // 2. Check for Supabase Session (Social Login Redirect)
    const handleOAuthRedirect = async () => {
      // Small delay to ensure URL fragments are processed by Supabase client
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (session && !hasSynced.current) {
        hasSynced.current = true // Prevent double sync in StrictMode
        setIsSyncing(true)
        
        try {
          const user = session.user
          const response = await axios.post(`${import.meta.env.VITE_API_URL || 'https://project-management-8lud.onrender.com'}/api/auth/oauth-sync`, {
            email: user.email,
            name: user.user_metadata.full_name || user.email.split('@')[0]
          })
          
          // Store our enterprise token and user info
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("userName", response.data.userName)
          localStorage.setItem("emailId", response.data.emailId)
          localStorage.setItem("userId", response.data.userId)
          
          toast.success('Identity verified via SSO')
          
          // Sign out of Supabase immediately so next login starts fresh
          await supabase.auth.signOut()
          
          // Final redirect to dashboard
          navigate("/projects")
        } catch (err) {
          console.error('SSO Sync Error:', err)
          toast.error('Identity synchronization failed')
          setIsSyncing(false)
        }
      }
    }

    handleOAuthRedirect()
  }, [navigate])

  if (isSyncing) {
    return (
      <div className="min-h-screen bg-enterprise-light flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-enterprise-dark border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-enterprise-dark uppercase tracking-widest">Establishing Secure Session...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-enterprise-light flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-enterprise-dark" />
      
      <div className="relative z-10 w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
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
