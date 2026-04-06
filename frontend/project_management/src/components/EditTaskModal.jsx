import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPlus, faCalendar, faFlag, faUser, faAlignLeft } from '@fortawesome/free-solid-svg-icons'

function EditTaskModal({ task, modules, onEditTask, onClose }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [moduleId, setModuleId] = useState('')
    const [priority, setPriority] = useState('medium')
    const [deadline, setDeadline] = useState('')
    const [assignedTo, setAssignedTo] = useState('')
    const [status, setStatus] = useState('todo')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Populate form with existing task data
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
                title,
                description,
                module_id: moduleId,
                priority,
                deadline: deadline || null,
                assigned_to: assignedTo || null,
                status
            })
        } catch (error) {
            console.error('Failed to update task:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon icon={faPlus} className="text-white text-sm" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Edit Task</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                        <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                            required
                            autoFocus
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Description
                        </label>
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faAlignLeft}
                                className="absolute left-3 top-3 text-gray-400 text-xs"
                            />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add more details..."
                                rows={3}
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm resize-none"
                            />
                        </div>
                    </div>

                    {/* Module Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Module <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={moduleId}
                            onChange={(e) => setModuleId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                            required
                        >
                            <option value="">Select a module</option>
                            {modules.map((module) => (
                                <option key={module.id} value={module.id}>
                                    {module.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                        >
                            <option value="todo">To Do</option>
                            <option value="in progress">In Progress</option>
                            <option value="done">Done</option>
                            <option value="blocked">Blocked</option>
                        </select>
                    </div>

                    {/* Priority & Deadline Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                <FontAwesomeIcon icon={faFlag} className="mr-1.5 text-gray-400" />
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                            >
                                <option value="low">🟢 Low</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="high">🔴 High</option>
                            </select>
                        </div>

                        {/* Deadline */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                <FontAwesomeIcon icon={faCalendar} className="mr-1.5 text-gray-400" />
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>

                    {/* Assignee */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            <FontAwesomeIcon icon={faUser} className="mr-1.5 text-gray-400" />
                            Assignee (optional)
                        </label>
                        <input
                            type="text"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                            placeholder="Enter assignee name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !title.trim() || !moduleId}
                            className="flex-1 px-4 py-2.5 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditTaskModal
