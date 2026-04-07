import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPlus, faCalendar, faFlag, faUser, faAlignLeft, faCommentAlt, faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { toast } from 'react-hot-toast'

function EditTaskModal({ task, modules, workspaceMembers, onEditTask, onClose }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [moduleId, setModuleId] = useState('')
    const [priority, setPriority] = useState('medium')
    const [deadline, setDeadline] = useState('')
    const [assignedTo, setAssignedTo] = useState('')
    const [status, setStatus] = useState('todo')
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    // Comments State
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [isPostingComment, setIsPostingComment] = useState(false)

    useEffect(() => {
        if (task) {
            setTitle(task.title || '')
            setDescription(task.description || '')
            setModuleId(task.module_id || '')
            setPriority(task.priority || 'medium')
            setDeadline(task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '')
            setAssignedTo(task.assigned_to || '')
            setStatus(task.status || 'todo')
            fetchComments()
        }
    }, [task])

    const fetchComments = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://project-management-8lud.onrender.com'}/api/comments/${task.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setComments(res.data)
        } catch (error) { console.error('Failed to fetch comments:', error) }
    }

    const handlePostComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return
        setIsPostingComment(true)
        try {
            const token = localStorage.getItem("token")
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'https://project-management-8lud.onrender.com'}/api/comments`, {
                task_id: task.id,
                content: newComment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setComments([...comments, res.data])
            setNewComment('')
            toast.success('Comment logged in system')
        } catch (error) { 
            console.error(error)
            toast.error('Failed to log comment')
        } finally { setIsPostingComment(false) }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            const token = localStorage.getItem("token")
            await axios.delete(`${import.meta.env.VITE_API_URL || 'https://project-management-8lud.onrender.com'}/api/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setComments(comments.filter(c => c.id !== commentId))
            toast.success('Comment redacted')
        } catch (error) { 
            console.error(error)
            toast.error('Redaction failed')
        }
    }

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
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-4xl overflow-hidden border border-white/60 flex h-[85vh] animate-in zoom-in-95 duration-300">
                {/* Left Side: Task Properties */}
                <div className="flex-1 overflow-y-auto border-r border-enterprise-muted/10">
                    <div className="flex items-center justify-between px-8 py-6 border-b border-enterprise-muted/10 bg-enterprise-light/30">
                        <h2 className="text-sm font-bold text-enterprise-dark uppercase tracking-widest">Configuration</h2>
                        <button onClick={onClose} className="text-enterprise-muted hover:text-enterprise-dark md:hidden"><FontAwesomeIcon icon={faXmark} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-enterprise-muted uppercase tracking-[0.3em] mb-2 px-1">Task Descriptor</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-5 py-3 text-sm bg-enterprise-light border border-enterprise-muted/20 rounded-xl focus:ring-2 focus:ring-enterprise-dark outline-none font-bold text-enterprise-dark" required />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-enterprise-muted uppercase tracking-[0.3em] mb-2 px-1">Technical Requirements</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-5 py-3 text-sm bg-enterprise-light border border-enterprise-muted/20 rounded-xl focus:ring-2 focus:ring-enterprise-dark outline-none font-medium resize-none text-enterprise-dark" />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-enterprise-muted uppercase tracking-[0.3em] mb-2 px-1">Domain Module</label>
                                <select value={moduleId} onChange={(e) => setModuleId(e.target.value)} className="w-full px-5 py-3 text-xs bg-enterprise-light border border-enterprise-muted/20 rounded-xl outline-none font-bold text-enterprise-dark" required>
                                    <option value="">Select Domain</option>
                                    {modules.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-enterprise-muted uppercase tracking-[0.3em] mb-2 px-1">Lifecycle Status</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-5 py-3 text-xs bg-enterprise-light border border-enterprise-muted/20 rounded-xl outline-none font-bold text-enterprise-dark">
                                    <option value="todo">Pending</option>
                                    <option value="in progress">Active Flow</option>
                                    <option value="done">Completed</option>
                                    <option value="blocked">Obstructed</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-enterprise-muted uppercase tracking-[0.3em] mb-2 px-1">Weight Index</label>
                                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-5 py-3 text-xs bg-enterprise-light border border-enterprise-muted/20 rounded-xl outline-none font-bold text-enterprise-dark">
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">Critical Level</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-enterprise-muted uppercase tracking-[0.3em] mb-2 px-1">Deadline Horizon</label>
                                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full px-5 py-3 text-xs bg-enterprise-light border border-enterprise-muted/20 rounded-xl outline-none font-bold text-enterprise-dark" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-enterprise-muted uppercase tracking-[0.3em] mb-2 px-1">Primary Operator</label>
                            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full px-5 py-3 text-xs bg-enterprise-light border border-enterprise-muted/20 rounded-xl outline-none font-bold text-enterprise-dark">
                                <option value="">Unassigned</option>
                                {workspaceMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button type="button" onClick={onClose} className="flex-1 py-3 px-6 border border-enterprise-muted/30 text-enterprise-muted font-bold uppercase text-[10px] tracking-[0.2em] rounded-lg hover:bg-enterprise-light transition-all">Cancel Operation</button>
                            <button type="submit" disabled={isSubmitting || !title.trim() || !moduleId} className="flex-1 py-3 px-6 bg-enterprise-dark text-white font-bold uppercase text-[10px] tracking-[0.2em] rounded-lg hover:bg-enterprise-accent shadow-lg shadow-enterprise-dark/20 transition-all">
                                {isSubmitting ? 'Syncing...' : 'Persist State'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side: Comments System */}
                <div className="w-[380px] bg-enterprise-light/30 flex flex-col h-full">
                    <div className="flex items-center justify-between px-6 py-6 border-b border-enterprise-muted/10 bg-white/50">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faCommentAlt} className="text-enterprise-muted text-xs" />
                            <h3 className="text-[10px] font-black text-enterprise-dark uppercase tracking-[0.2em]">Operational Ledger</h3>
                        </div>
                        <button onClick={onClose} className="text-enterprise-muted hover:text-enterprise-dark hidden md:block"><FontAwesomeIcon icon={faXmark} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        {comments.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                <FontAwesomeIcon icon={faCommentAlt} className="text-3xl mb-4" />
                                <p className="text-[10px] font-bold uppercase tracking-widest leading-loose">No communications<br/>logged for this entity</p>
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="group animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex items-center justify-between mb-1.5 px-1">
                                        <span className="text-[9px] font-black text-enterprise-dark uppercase tracking-widest">{comment.users?.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[8px] font-bold text-enterprise-muted uppercase">{new Date(comment.created_at).toLocaleDateString()}</span>
                                            {comment.user_id === localStorage.getItem("userId") && (
                                                <button onClick={() => handleDeleteComment(comment.id)} className="text-[8px] text-red-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-black hover:text-red-600">Delete</button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-white border border-enterprise-muted/10 p-3 rounded-xl shadow-sm text-xs font-medium text-enterprise-dark leading-relaxed">
                                        {comment.content}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-6 bg-white border-t border-enterprise-muted/10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                        <form onSubmit={handlePostComment} className="relative">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Log a transmission..."
                                rows={2}
                                className="w-full pl-4 pr-12 py-3 bg-enterprise-light border border-enterprise-muted/20 rounded-xl focus:ring-1 focus:ring-enterprise-dark outline-none text-xs font-medium resize-none placeholder:text-enterprise-muted/40 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={isPostingComment || !newComment.trim()}
                                className="absolute right-3 bottom-3 w-8 h-8 bg-enterprise-dark text-white rounded-lg flex items-center justify-center hover:bg-enterprise-accent transition-all shadow-md disabled:opacity-30"
                            >
                                <FontAwesomeIcon icon={faPaperPlane} className="text-[10px]" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditTaskModal
