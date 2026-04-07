import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPlus, faCalendar, faFlag, faUser, faAlignLeft } from '@fortawesome/free-solid-svg-icons'

function CreateTaskModal({ modules, workspaceMembers, workspaceId, defaultPriority, onCreateTask, onClose }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [moduleId, setModuleId] = useState('')
    const [priority, setPriority] = useState(defaultPriority || 'medium')
    const [deadline, setDeadline] = useState('')
    const [assignedTo, setAssignedTo] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim() || !moduleId) return
        setIsSubmitting(true)
        try {
            await onCreateTask({
                title, description, 
                module_id: moduleId,
                workspace_id: workspaceId,
                priority, deadline: deadline || null,
                assigned_to: assignedTo || null, status: 'todo'
            })
        } catch (error) { console.error('Failed to create task:', error) }
        finally { setIsSubmitting(false) }
    }

    return (
        <div className="fixed inset-0 bg-enterprise-dark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden border border-enterprise-muted/20 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between px-6 py-4 border-b border-enterprise-muted/10 bg-enterprise-light/50">
                    <h2 className="text-sm font-bold text-enterprise-dark uppercase tracking-widest">Create Operational Task</h2>
                    <button onClick={onClose} className="text-enterprise-muted hover:text-enterprise-dark transition-colors"><FontAwesomeIcon icon={faXmark} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-1.5">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task summary" className="w-full px-3 py-2 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark focus:border-enterprise-dark outline-none transition-all font-semibold text-enterprise-dark" required autoFocus />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-1.5">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed technical requirements..." rows={3} className="w-full px-3 py-2 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark focus:border-enterprise-dark outline-none transition-all font-medium resize-none text-enterprise-dark" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-1.5">Module Selection</label>
                            <select value={moduleId} onChange={(e) => setModuleId(e.target.value)} className="w-full px-3 py-2 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark outline-none cursor-pointer font-semibold text-enterprise-dark" required>
                                <option value="">Select Module</option>
                                {modules.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-1.5">Priority Level</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-3 py-2 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark outline-none cursor-pointer font-semibold text-enterprise-dark">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-1.5">Assignee</label>
                            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full px-3 py-2 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark outline-none cursor-pointer font-semibold text-enterprise-dark">
                                <option value="">Unassigned</option>
                                {workspaceMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-1.5">Deadline</label>
                            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full px-3 py-2 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark outline-none font-semibold text-enterprise-dark" />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-2 px-4 border border-enterprise-muted/30 text-enterprise-muted font-bold uppercase text-[10px] tracking-widest rounded hover:bg-enterprise-light transition-all">Cancel</button>
                        <button type="submit" disabled={isSubmitting || !title.trim() || !moduleId} className="flex-1 py-2 px-4 bg-enterprise-dark text-white font-bold uppercase text-[10px] tracking-widest rounded hover:bg-enterprise-accent transition-all shadow-md disabled:opacity-50">{isSubmitting ? 'Processing...' : 'Deploy Task'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateTaskModal
