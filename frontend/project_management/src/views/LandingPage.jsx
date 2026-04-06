import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../utils/auth'

function LandingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/projects");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-pink-200 via-purple-200 to-transparent rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-violet-200 via-pink-100 to-transparent rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-100 via-fuchsia-100 to-pink-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex flex-row items-center justify-between px-8 py-6">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          TaskFlow
        </div>
        <div className="flex flex-row items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 text-gray-700 font-medium rounded-full hover:bg-white/60 hover:shadow-sm transition-all duration-300"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:scale-105 transition-all duration-300"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-20">
        <div className="max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-600">Now with real-time collaboration</span>
          </div>
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-pink-700 bg-clip-text text-transparent">
              Manage projects
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
              like a pro
            </span>
          </h1>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Streamline your workflow with intelligent workspaces, seamless task tracking, and powerful collaboration tools.
          </p>
          <div className="flex flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-full shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-pink-300 hover:scale-105 transition-all duration-300"
            >
              Start Free — It's Free
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-full shadow-md hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Watch Demo
            </button>
          </div>
        </div>

        {/* Mock UI Preview */}
        <div className="mt-20 w-full max-w-4xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-100 border border-white/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mb-3" />
                <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                <div className="h-2 w-16 bg-gray-100 rounded" />
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg mb-3" />
                <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                <div className="h-2 w-16 bg-gray-100 rounded" />
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-violet-600 rounded-lg mb-3" />
                <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                <div className="h-2 w-16 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-3 gap-6 max-w-5xl w-full">
          <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/50">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📁</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Workspaces</h3>
            <p className="text-gray-500 leading-relaxed">Organize multiple workspaces for different teams or projects</p>
          </div>
          <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/50">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Projects</h3>
            <p className="text-gray-500 leading-relaxed">Create and manage projects with detailed task tracking</p>
          </div>
          <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/50">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-violet-200 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Collaboration</h3>
            <p className="text-gray-500 leading-relaxed">Work together with your team in real-time</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 flex items-center gap-16">
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">10k+</div>
            <div className="text-gray-500 mt-1">Active Users</div>
          </div>
          <div className="w-px h-12 bg-gray-300" />
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">500+</div>
            <div className="text-gray-500 mt-1">Projects</div>
          </div>
          <div className="w-px h-12 bg-gray-300" />
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">99%</div>
            <div className="text-gray-500 mt-1">Satisfaction</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-8 text-center">
        <div className="text-gray-400 text-sm">
          © 2026 TaskFlow. Crafted with care.
        </div>
      </footer>
    </div>
  )
}

export default LandingPage