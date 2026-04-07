import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../utils/auth'

function LandingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) navigate("/projects")
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-slate-100 font-sans text-enterprise-dark">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-12 py-6 border-b border-enterprise-light">
        <div className="text-xl font-bold tracking-tighter border-l-4 border-enterprise-dark pl-3">
          TASKFLOW <span className="text-enterprise-muted font-light">ENTERPRISE</span>
        </div>
        <div className="flex items-center gap-8">
          <button onClick={() => navigate("/login")} className="text-xs font-bold uppercase tracking-widest text-enterprise-muted hover:text-enterprise-dark transition-colors">Client Login</button>
          <button onClick={() => navigate("/login")} className="px-6 py-2 bg-enterprise-dark text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded hover:bg-enterprise-accent transition-all shadow-sm">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-12 py-32">
        <div className="flex flex-col items-center text-center">
          <div className="inline-block px-3 py-1 bg-enterprise-light border border-enterprise-muted/20 text-[9px] font-black uppercase tracking-[0.3em] text-enterprise-dark mb-10 rounded">
            Version 2.0 Deployment Ready
          </div>
          <h1 className="text-6xl font-bold tracking-tighter mb-8 max-w-4xl leading-[1.1]">
            Engineering operational excellence for <span className="text-enterprise-muted italic font-serif">modern teams.</span>
          </h1>
          <p className="text-lg text-enterprise-muted max-w-2xl mb-12 font-medium leading-relaxed">
            Centralize project architecture, automate task deployment, and synchronize team collaboration within a high-performance workspace.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/login")} className="px-10 py-4 bg-enterprise-dark text-white font-bold uppercase text-xs tracking-[0.2em] rounded hover:bg-enterprise-accent transition-all shadow-lg">Start Deployment</button>
            <button className="px-10 py-4 border border-enterprise-muted/30 text-enterprise-dark font-bold uppercase text-xs tracking-[0.2em] rounded hover:bg-enterprise-light transition-all">Schedule Demo</button>
          </div>
        </div>

        {/* Feature Matrix */}
        <div className="mt-40 grid grid-cols-3 gap-12">
          {[
            { t: 'Multi-tenant Workspaces', d: 'Isolate team resources with secure, hierarchical workspace structures.' },
            { t: 'Modular Architecture', d: 'Break complex projects into manageable operational modules.' },
            { t: 'Unified Task Tracking', d: 'Maintain real-time visibility across the entire project lifecycle.' }
          ].map((f, i) => (
            <div key={i} className="group">
              <div className="w-10 h-10 bg-enterprise-light rounded border border-enterprise-muted/20 flex items-center justify-center mb-6 group-hover:bg-enterprise-dark group-hover:text-white transition-all">
                <span className="text-xs font-bold">{i+1}</span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-3">{f.t}</h3>
              <p className="text-xs text-enterprise-muted leading-relaxed font-medium">{f.d}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="px-12 py-12 border-t border-enterprise-light flex justify-between items-center text-[10px] font-bold text-enterprise-muted uppercase tracking-[0.3em]">
        <div>© 2026 TaskFlow Systems Inc.</div>
        <div className="flex gap-8">
          <span className="cursor-pointer hover:text-enterprise-dark">Privacy Protocol</span>
          <span className="cursor-pointer hover:text-enterprise-dark">Security Standards</span>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
