import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPlus, faCalendar, faFlag, faUser, faAlignLeft } from '@fortawesome/free-solid-svg-icons'

function EditTaskModal({ task, modules, workspaceMembers, onEditTask, onClose }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [moduleId, setModuleId] = useState('')
    const [priority, setPriority] = useState('medium')
    const [deadline, setDeadline] = useState('')
    const [assignedTo, setAssignedTo] = useState('')
    const [status, setStatus] = useState('todo')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (task) {
            setTitle(task.title || '')
            setDescription(task.description || '')
            setModuleId(task.module_id || '')
            setPriority(task.priority || 'medium')
            setDeadline(task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '')
            setAssignedTo(task.assigned_to || '')
            setStatus(task.status || 'todo')
        }
    }, [task])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim() || !moduleId) return
        setIsSubmitting(true)
        try {
            await onEditTask(task.id, {
                title, description, module_id: moduleId,
                priority, deadline: deadline || null,
                assigned_to: assignedTo || null, status
            })
        } catch (error) { console.error('Failed to update task:', error) }
        finally { setIsSubmitting(false) }
    }

    return (
        <div className="fixed inset-0 bg-enterprise-dark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden border border-enterprise-muted/20 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-enterprise-muted/10 bg-enterprise-light/50">
                    <h2 className="text-sm font-bold text-enterprise-dark uppercase tracking-widest">Modify Task Properties</h2>
                    <button onClick={onClose} className="text-enterprise-muted hover:text-enterprise-dark transition-colors"><FontAwesomeIcon icon={faXmark} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-1.5">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task summary" className="w-full px-3 py-2 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark focus:border-enterprise-dark outline-none transition-all font-semibold" required />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-1.5">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Technical details..." rows={3} className="w-full px-3 py-2 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark focus:border-enterprise-dark outline-none transition-all font-medium resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-1.5">Module Selection</label>
                            <select value={moduleId} onChange={(e) => setModuleId(e.target.value)} className="w-full px-3 py-2 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark outline-none cursor-pointer font-semibold" required>
                                <option value="">Select Module</option>
                                {modules.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-1.5">Task Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark outline-none cursor-pointer font-semibold">
                                <option value="todo">To Do</option>
                                <option value="in progress">In Progress</option>
                                <option value="done">Done</option>
                                <option value="blocked">Blocked</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-1.5">Priority</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-3 py-2 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark outline-none cursor-pointer font-semibold">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-1.5">Deadline</label>
                            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full px-3 py-2 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark outline-none font-semibold" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-1.5">Assignee</label>
                        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full px-3 py-2 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark outline-none cursor-pointer font-semibold">
                            <option value="">Unassigned</option>
                            {workspaceMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-2 px-4 border border-enterprise-muted/30 text-enterprise-muted font-bold uppercase text-[10px] tracking-widest rounded hover:bg-enterprise-light transition-all">Cancel</button>
                        <button type="submit" disabled={isSubmitting || !title.trim() || !moduleId} className="flex-1 py-2 px-4 bg-enterprise-dark text-white font-bold uppercase text-[10px] tracking-widest rounded hover:bg-enterprise-accent transition-all shadow-md disabled:opacity-50">{isSubmitting ? 'Syncing...' : 'Persist Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditTaskModal
