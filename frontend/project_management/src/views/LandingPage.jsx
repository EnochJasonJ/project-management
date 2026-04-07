import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../utils/auth'

function LandingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) navigate("/projects")
  }, [navigate]);

  return (
    <div className="min-h-screen bg-enterprise-light font-sans text-enterprise-dark relative overflow-hidden">
      {/* Professional Gradient Mesh Background */}
      <div className="absolute inset-0 z-0">
        {/* Deep mesh layer 1 */}
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-[#d1dbe4] rounded-full blur-[120px] opacity-60 animate-pulse" style={{ animationDuration: '8s' }} />
        
        {/* Deep mesh layer 2 */}
        <div className="absolute top-[10%] right-[-5%] w-[60%] h-[60%] bg-[#e2e8f0] rounded-full blur-[150px] opacity-70" />
        
        {/* Accent mesh layer 3 */}
        <div className="absolute bottom-[-20%] left-[10%] w-[80%] h-[80%] bg-enterprise-muted/20 rounded-full blur-[130px] opacity-50 animate-pulse" style={{ animationDuration: '12s' }} />
        
        {/* Contrast mesh layer 4 */}
        <div className="absolute top-[40%] left-[30%] w-[50%] h-[50%] bg-white rounded-full blur-[100px] opacity-80" />
        
        {/* Structural Gunmetal Glow (Subtle) */}
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-enterprise-dark/5 rounded-full blur-[120px] opacity-40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-12 py-6 border-b border-enterprise-dark/5 backdrop-blur-md bg-white/20">
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
            <div className="inline-block px-4 py-1.5 bg-white/60 backdrop-blur-sm border border-enterprise-muted/20 text-[9px] font-black uppercase tracking-[0.3em] text-enterprise-dark mb-10 rounded shadow-sm">
              Version 2.0 Deployment Ready
            </div>
            <h1 className="text-7xl font-bold tracking-tighter mb-8 max-w-4xl leading-[1.05] text-enterprise-dark">
              Engineering operational excellence for <span className="text-enterprise-muted italic font-serif">modern teams.</span>
            </h1>
            <p className="text-xl text-enterprise-muted max-w-2xl mb-12 font-medium leading-relaxed">
              Centralize project architecture, automate task deployment, and synchronize team collaboration within a high-performance workspace.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/login")} className="px-10 py-4 bg-enterprise-dark text-white font-bold uppercase text-xs tracking-[0.2em] rounded hover:bg-enterprise-accent transition-all shadow-xl shadow-enterprise-dark/20">Start Deployment</button>
              <button onClick={() => navigate("/login")} className="px-10 py-4 bg-white/40 backdrop-blur-md border border-enterprise-muted/30 text-enterprise-dark font-bold uppercase text-xs tracking-[0.2em] rounded hover:bg-white transition-all">Schedule Demo</button>
            </div>
          </div>

          {/* Feature Matrix */}
          <div className="mt-40 grid grid-cols-3 gap-16">
            {[
              { t: 'Multi-tenant Workspaces', d: 'Isolate team resources with secure, hierarchical workspace structures.' },
              { t: 'Modular Architecture', d: 'Break complex projects into manageable operational modules.' },
              { t: 'Unified Task Tracking', d: 'Maintain real-time visibility across the entire project lifecycle.' }
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-3xl hover:bg-white/30 transition-all duration-500 border border-transparent hover:border-white/50">
                <div className="w-12 h-12 bg-white rounded-xl border border-enterprise-muted/20 flex items-center justify-center mb-8 group-hover:bg-enterprise-dark group-hover:text-white transition-all shadow-sm">
                  <span className="text-sm font-bold">{i+1}</span>
                </div>
                <h3 className="text-base font-bold uppercase tracking-widest mb-4">{f.t}</h3>
                <p className="text-sm text-enterprise-muted leading-relaxed font-medium">{f.d}</p>
              </div>
            ))}
          </div>
        </main>

        <footer className="px-12 py-12 border-t border-enterprise-dark/5 flex justify-between items-center text-[10px] font-bold text-enterprise-muted uppercase tracking-[0.3em] backdrop-blur-sm">
          <div>© 2026 TaskFlow Systems Inc.</div>
          <div className="flex gap-8">
            <span className="cursor-pointer hover:text-enterprise-dark transition-colors">Privacy Protocol</span>
            <span className="cursor-pointer hover:text-enterprise-dark transition-colors">Security Standards</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default LandingPage
