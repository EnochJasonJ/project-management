import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle'
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import { supabase } from '../utils/supabaseClient'
import { toast } from 'react-hot-toast'

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const URL = `${import.meta.env.VITE_API_URL || 'https://project-management-8lud.onrender.com'}/api/auth/login`

  const LoginUser = async () => {
    if (!email || !password) return
    setIsLoading(true)
    try {
      const response = await axios.post(URL, { email, password })
      localStorage.setItem("token", response.data['token'])
      localStorage.setItem("userName", response.data["userName"])
      localStorage.setItem("emailId", response.data["emailId"])
      localStorage.setItem("userId", response.data["userId"])
      toast.success('Authentication successful')
      navigate("/projects")
    } catch (error) { 
      console.error(error)
      toast.error('Invalid credentials')
    }
    finally { setIsLoading(false) }
  }

  const handleSocialLogin = async (provider) => {
    try {
      // Redirect to /login so the LoginPage can process the session before PrivateRoute catches it
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/login'
        }
      })
      if (error) throw error
    } catch (error) {
      console.error(error)
      toast.error(`Failed to initiate ${provider} login`)
    }
  }

  return (
    <div className="bg-white border border-enterprise-muted/20 shadow-xl rounded-xl p-8">
      <div className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-2 px-1">Institutional Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="w-full px-4 py-3 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark outline-none transition-all font-semibold text-enterprise-dark" />
        </div>
        <div>
          <label htmlFor="pwd" className="block text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-2 px-1">Secure Password</label>
          <input type="password" id="pwd" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark outline-none transition-all font-semibold text-enterprise-dark" />
        </div>
      </div>

      <button onClick={LoginUser} disabled={isLoading} className="w-full mt-8 py-3 bg-enterprise-dark text-white font-bold uppercase text-[10px] tracking-[0.2em] rounded hover:bg-enterprise-accent transition-all shadow-md disabled:opacity-50">
        {isLoading ? "Authenticating Credentials..." : "Access Workspace"}
      </button>

      <div className="flex items-center gap-4 mt-8">
        <div className="flex-1 h-px bg-enterprise-light" />
        <span className="text-[9px] font-bold text-enterprise-muted uppercase tracking-widest">Enterprise SSO</span>
        <div className="flex-1 h-px bg-enterprise-light" />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <button 
          onClick={() => handleSocialLogin('google')}
          className="flex items-center justify-center gap-2 py-2 border border-enterprise-muted/20 rounded hover:bg-enterprise-light transition-all text-[10px] font-bold text-enterprise-muted"
        >
          <FontAwesomeIcon icon={faGoogle} /> Google
        </button>
        <button 
          onClick={() => handleSocialLogin('github')}
          className="flex items-center justify-center gap-2 py-2 border border-enterprise-muted/20 rounded hover:bg-enterprise-light transition-all text-[10px] font-bold text-enterprise-muted"
        >
          <FontAwesomeIcon icon={faGithub} /> GitHub
        </button>
      </div>

      <p className="text-center mt-8 text-[10px] font-bold text-enterprise-muted uppercase tracking-widest">
        Deployment Issues? <span className="text-enterprise-dark hover:underline cursor-pointer">Contact Support</span>
      </p>
    </div>
  )
}

export default LoginForm
