import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle'
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/login`

  const LoginUser = async () => {
    if (!email || !password) return
    setIsLoading(true)
    try {
      const response = await axios.post(URL, { email, password })
      const token = response.data['token']
      const userName = response.data["userName"]
      const emailId = response.data["emailId"]
      const userId = response.data["userId"]
      localStorage.setItem("token", token)
      localStorage.setItem("user", userName)
      localStorage.setItem("email", emailId)
      localStorage.setItem("userId", userId)
      navigate("/projects")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative z-10 w-full max-w-md px-6">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-100 border border-white/50 p-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-pink-200 mb-4">
            <span className="text-2xl font-bold text-white">T</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">Sign in to continue to TaskFlow</p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              autoComplete="off"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
          </div>
          <div>
            <label htmlFor="pwd" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              autoComplete="off"
              name="pwd"
              id="pwd"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          onClick={LoginUser}
          disabled={isLoading}
          className="w-full mt-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-pink-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mt-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          <span className="text-sm text-gray-400 font-medium">or continue with</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </div>

        {/* OAuth */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button className="p-3 bg-white/80 border border-gray-200 rounded-xl hover:bg-white hover:shadow-md hover:scale-105 transition-all duration-200">
            <FontAwesomeIcon icon={faGoogle} className="text-xl text-gray-700" />
          </button>
          <button className="p-3 bg-white/80 border border-gray-200 rounded-xl hover:bg-white hover:shadow-md hover:scale-105 transition-all duration-200">
            <FontAwesomeIcon icon={faGithub} className="text-xl text-gray-700" />
          </button>
        </div>

        {/* Sign up link */}
        <p className="text-center mt-8 text-gray-500">
          New to TaskFlow?{' '}
          <span className="text-purple-600 font-semibold cursor-pointer hover:text-pink-500 transition-colors duration-200">
            Create an account
          </span>
        </p>
      </div>
    </div>
  )
}

export default LoginForm