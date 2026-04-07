import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPlus, faAlignLeft } from '@fortawesome/free-solid-svg-icons'

function CreateProjectModal({ createProject, selectedWorkspace, onClose }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !selectedWorkspace) return
    setIsSubmitting(true)
    try {
      await createProject({
        name,
        description,
        workspace_id: selectedWorkspace.id
      })
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-enterprise-dark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden border border-enterprise-muted/20 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-enterprise-muted/10 bg-enterprise-light/50">
          <h2 className="text-sm font-bold text-enterprise-dark uppercase tracking-widest">Initialize New Project</h2>
          <button onClick={onClose} className="text-enterprise-muted hover:text-enterprise-dark transition-colors"><FontAwesomeIcon icon={faXmark} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-1.5 px-1">Project Descriptor</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="System name..." 
              className="w-full px-3 py-2 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark outline-none transition-all font-semibold text-enterprise-dark"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-1.5 px-1">Objective Summary</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="High-level project goals..." 
              rows={3}
              className="w-full px-3 py-2 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark outline-none transition-all font-medium resize-none text-enterprise-dark"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 px-4 border border-enterprise-muted/30 text-enterprise-muted font-bold uppercase text-[10px] tracking-widest rounded hover:bg-enterprise-light transition-all">Abort</button>
            <button type="submit" disabled={isSubmitting || !name.trim()} className="flex-1 py-2 px-4 bg-enterprise-dark text-white font-bold uppercase text-[10px] tracking-widest rounded hover:bg-enterprise-accent shadow-md disabled:opacity-50">
              {isSubmitting ? 'Processing...' : 'Confirm Initiation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProjectModal
