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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-50 relative overflow-hidden flex items-center justify-center">
      {/* Background decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-pink-200 via-purple-200 to-transparent rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-violet-200 via-pink-100 to-transparent rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <LoginForm />

      {/* Back to home link */}
      <a
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to home
      </a>
    </div>
  )
}

export default LoginPage