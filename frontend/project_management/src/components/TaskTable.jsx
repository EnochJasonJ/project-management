import React, { useState, useEffect, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus, faSearch, faFilter, faSort, faSortUp, faSortDown,
    faGripVertical, faTable, faThLarge, faList, faEllipsisV,
    faCheckCircle, faCircle, faClock, faExclamationCircle,
    faFlag, faCalendar, faUser, faChevronDown, faArrowUpWideShort, faPen
} from '@fortawesome/free-solid-svg-icons'
import EditTaskModal from './EditTaskModal'

// Status configuration
const STATUS_CONFIG = {
    'todo': { label: 'To Do', color: 'bg-gray-100 text-gray-700', icon: faCircle },
    'in progress': { label: 'In Progress', color: 'bg-amber-100 text-amber-700', icon: faClock },
    'done': { label: 'Done', color: 'bg-green-100 text-green-700', icon: faCheckCircle },
    'blocked': { label: 'Blocked', color: 'bg-red-100 text-red-700', icon: faExclamationCircle }
}

// Priority configuration
const PRIORITY_CONFIG = {
    'high': { label: 'High', color: 'text-red-600', bg: 'bg-red-50', icon: '🔴' },
    'medium': { label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50', icon: '🟡' },
    'low': { label: 'Low', color: 'text-green-600', bg: 'bg-green-50', icon: '🟢' }
}

function TaskTable({ tasks, setTasks, modules, selectedProject, selectedWorkspace, workspaceMembers, onCreateTask, onEditTask }) {
    const [viewMode, setViewMode] = useState('table') // 'table', 'board', 'list'
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' })
    const [filterConfig, setFilterConfig] = useState({ status: [], priority: [], assignee: [] })
    const [showFilters, setShowFilters] = useState(false)
    const [selectedTasks, setSelectedTasks] = useState(new Set())
    const [editingCell, setEditingCell] = useState(null) // { taskId, field }
    const [hoveredRow, setHoveredRow] = useState(null)
    const [draggedTask, setDraggedTask] = useState(null)
    const [taskToEdit, setTaskToEdit] = useState(null) // For edit modal
    const [showActionsMenu, setShowActionsMenu] = useState(null) // taskId of open menu

    // Filter and sort tasks
    const filteredTasks = useMemo(() => {
        let result = [...tasks]

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(task =>
                task.title?.toLowerCase().includes(query) ||
                task.description?.toLowerCase().includes(query)
            )
        }

        // Status filter
        if (filterConfig.status.length > 0) {
            result = result.filter(task => filterConfig.status.includes(task.status))
        }

        // Priority filter
        if (filterConfig.priority.length > 0) {
            result = result.filter(task => filterConfig.priority.includes(task.priority))
        }

        // Sort
        result.sort((a, b) => {
            let aVal = a[sortConfig.key]
            let bVal = b[sortConfig.key]

            if (sortConfig.key === 'priority') {
                const priorityOrder = { high: 0, medium: 1, low: 2 }
                aVal = priorityOrder[a.priority] || 3
                bVal = priorityOrder[b.priority] || 3
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })

        return result
    }, [tasks, searchQuery, sortConfig, filterConfig])

    // Handle sort
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    // Handle status update
    const updateTaskStatus = async (taskId, newStatus) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            })
            if (response.ok) {
                const updated = await response.json()
                setTasks(prev => prev.map(t => t.id === taskId ? updated : t))
            }
        } catch (error) {
            console.error('Failed to update task:', error)
        }
        setEditingCell(null)
    }

    // Handle priority update
    const updateTaskPriority = async (taskId, newPriority) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ priority: newPriority })
            })
            if (response.ok) {
                const updated = await response.json()
                setTasks(prev => prev.map(t => t.id === taskId ? updated : t))
            }
        } catch (error) {
            console.error('Failed to update task:', error)
        }
        setEditingCell(null)
    }

    // Toggle task selection
    const toggleTaskSelection = (taskId) => {
        setSelectedTasks(prev => {
            const newSet = new Set(prev)
            if (newSet.has(taskId)) {
                newSet.delete(taskId)
            } else {
                newSet.add(taskId)
            }
            return newSet
        })
    }

    // Get module name for task
    const getModuleName = (moduleId) => {
        const module = modules.find(m => m.id === moduleId)
        return module?.name || 'No Module'
    }

    // Handle edit task
    const handleEditTask = async (taskId, taskData) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(taskData)
            })
            if (response.ok) {
                // To show name correctly, we need to find the user in workspaceMembers
                const updated = await response.json()
                if (updated.assigned_to) {
                   const user = workspaceMembers.find(m => m.id === updated.assigned_to)
                   updated.users = user ? { id: user.id, name: user.name, email: user.email } : null
                } else {
                   updated.users = null
                }
                setTasks(prev => prev.map(t => t.id === taskId ? updated : t))
                setTaskToEdit(null)
            }
        } catch (error) {
            console.error('Failed to update task:', error)
        }
    }

    const handleDeleteTask = async (taskId, skipConfirm = false) => {
        if (!skipConfirm && !window.confirm('Are you sure you want to delete this task?')) return
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                setTasks(prev => prev.filter(t => t.id !== taskId))
                setSelectedTasks(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(taskId)
                    return newSet
                })
            }
        } catch (error) {
            console.error('Failed to delete task:', error)
        }
    }

    const handleBulkDeleteTasks = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedTasks.size} task(s)?`)) return
        for (const taskId of selectedTasks) {
            await handleDeleteTask(taskId, true)
        }
        setSelectedTasks(new Set())
    }

    // Close actions menu when clicking elsewhere
    useEffect(() => {
        const handleClickOutside = () => setShowActionsMenu(null)
        if (showActionsMenu) {
            document.addEventListener('click', handleClickOutside)
            return () => document.removeEventListener('click', handleClickOutside)
        }
    }, [showActionsMenu])

    // Sort icon helper
    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) return faSort
        return sortConfig.direction === 'asc' ? faSortUp : faSortDown
    }

    const renderActionsMenu = (task) => (
        <div className="absolute right-0 top-8 z-30 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-40">
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    setTaskToEdit(task)
                    setShowActionsMenu(null)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
                <FontAwesomeIcon icon={faPen} size="xs" className="text-gray-400" />
                Edit Task
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id);
                    setShowActionsMenu(null);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
                <FontAwesomeIcon icon={faClock} size="xs" className="text-red-400" />
                Delete Task
            </button>
        </div>
    )

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Toolbar - Notion-style */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                {/* Left: Search + Filters */}
                <div className="flex items-center gap-2">
                    {/* Search */}
                    <div className="relative">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-48"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                            filterConfig.status.length > 0 || filterConfig.priority.length > 0
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <FontAwesomeIcon icon={faFilter} size="xs" />
                        Filter
                    </button>

                    {/* Filter Dropdown */}
                    {showFilters && (
                        <div className="absolute top-12 left-2 z-20 bg-white rounded-lg shadow-lg border border-gray-200 p-3 w-48">
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                                    <div className="mt-1 space-y-1">
                                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={filterConfig.status.includes(key)}
                                                    onChange={(e) => {
                                                        setFilterConfig(prev => ({
                                                            ...prev,
                                                            status: e.target.checked
                                                                ? [...prev.status, key]
                                                                : prev.status.filter(s => s !== key)
                                                        }))
                                                    }}
                                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className={config.color.split(' ')[1]}>{config.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Priority</label>
                                    <div className="mt-1 space-y-1">
                                        {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                                            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={filterConfig.priority.includes(key)}
                                                    onChange={(e) => {
                                                        setFilterConfig(prev => ({
                                                            ...prev,
                                                            priority: e.target.checked
                                                                ? [...prev.priority, key]
                                                                : prev.priority.filter(p => p !== key)
                                                        }))
                                                    }}
                                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span>{config.icon} {config.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: View Toggle + Actions */}
                <div className="flex items-center gap-2">
                    {/* View Toggle */}
                    <div className="flex items-center bg-white border border-gray-300 rounded-md p-0.5">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded transition-colors ${
                                viewMode === 'table' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                            }`}
                            title="Table View"
                        >
                            <FontAwesomeIcon icon={faTable} size="sm" />
                        </button>
                        <button
                            onClick={() => setViewMode('board')}
                            className={`p-1.5 rounded transition-colors ${
                                viewMode === 'board' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                            }`}
                            title="Board View"
                        >
                            <FontAwesomeIcon icon={faThLarge} size="sm" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded transition-colors ${
                                viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                            }`}
                            title="List View"
                        >
                            <FontAwesomeIcon icon={faList} size="sm" />
                        </button>
                    </div>

                    {/* New Task Button */}
                    <button
                        onClick={onCreateTask}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        <FontAwesomeIcon icon={faPlus} size="xs" />
                        New Task
                    </button>
                </div>
            </div>

            {/* Selected Tasks Bar */}
            {selectedTasks.size > 0 && (
                <div className="flex items-center justify-between px-4 py-2 bg-indigo-50 border-b border-indigo-100">
                    <span className="text-sm text-indigo-700 font-medium">
                        {selectedTasks.size} task{selectedTasks.size > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="text-xs text-indigo-600 hover:text-indigo-800">Mark as Done</button>
                        <button 
                            className="text-xs text-red-600 hover:text-red-800"
                            onClick={handleBulkDeleteTasks}
                        >Delete</button>
                    </div>
                </div>
            )}

            {/* Table View - Notion-style */}
            {viewMode === 'table' && (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="w-10 px-4 py-2 text-center">
                                    <input
                                        type="checkbox"
                                        checked={filteredTasks.length > 0 && selectedTasks.size === filteredTasks.length}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedTasks(new Set(filteredTasks.map(t => t.id)))
                                            } else {
                                                setSelectedTasks(new Set())
                                            }
                                        }}
                                        className="rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                </th>
                                <th className="w-8 px-2 py-2"></th>
                                <th
                                    className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('title')}
                                >
                                    <div className="flex items-center gap-2">
                                        Task
                                        <FontAwesomeIcon icon={getSortIcon('title')} size="xs" className="text-gray-400" />
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('status')}
                                >
                                    <div className="flex items-center gap-2">
                                        Status
                                        <FontAwesomeIcon icon={getSortIcon('status')} size="xs" className="text-gray-400" />
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('priority')}
                                >
                                    <div className="flex items-center gap-2">
                                        Priority
                                        <FontAwesomeIcon icon={getSortIcon('priority')} size="xs" className="text-gray-400" />
                                    </div>
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Module
                                </th>
                                <th
                                    className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('assigned_to')}
                                >
                                    <div className="flex items-center gap-2">
                                        Assignee
                                        <FontAwesomeIcon icon={getSortIcon('assigned_to')} size="xs" className="text-gray-400" />
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('deadline')}
                                >
                                    <div className="flex items-center gap-2">
                                        Due Date
                                        <FontAwesomeIcon icon={getSortIcon('deadline')} size="xs" className="text-gray-400" />
                                    </div>
                                </th>
                                <th className="w-10 px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTasks.map((task, index) => (
                                <tr
                                    key={task.id}
                                    onMouseEnter={() => setHoveredRow(task.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    onClick={(e) => e.stopPropagation()}
                                    className={`group hover:bg-gray-50 transition-colors ${
                                        selectedTasks.has(task.id) ? 'bg-indigo-50' : ''
                                    }`}
                                >
                                    <td className="px-4 py-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedTasks.has(task.id)}
                                            onChange={() => toggleTaskSelection(task.id)}
                                            className="rounded text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </td>
                                    <td className="px-2 py-2 cursor-grab active:cursor-grabbing">
                                        <FontAwesomeIcon icon={faGripVertical} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" size="xs" />
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon
                                                icon={task.status === 'done' ? faCheckCircle : faCircle}
                                                className={`text-sm transition-colors ${
                                                    task.status === 'done' ? 'text-green-500' : 'text-gray-300'
                                                }`}
                                            />
                                            <span className={`text-sm ${
                                                task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'
                                            }`}>
                                                {task.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        {editingCell?.taskId === task.id && editingCell?.field === 'status' ? (
                                            <select
                                                value={task.status}
                                                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                                onBlur={() => setEditingCell(null)}
                                                autoFocus
                                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                                    <option key={key} value={key}>{config.label}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <button
                                                onClick={() => setEditingCell({ taskId: task.id, field: 'status' })}
                                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                                                    STATUS_CONFIG[task.status]?.color || 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                <FontAwesomeIcon icon={STATUS_CONFIG[task.status]?.icon || faCircle} size="xs" />
                                                {STATUS_CONFIG[task.status]?.label || task.status}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {editingCell?.taskId === task.id && editingCell?.field === 'priority' ? (
                                            <select
                                                value={task.priority}
                                                onChange={(e) => updateTaskPriority(task.id, e.target.value)}
                                                onBlur={() => setEditingCell(null)}
                                                autoFocus
                                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                                {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                                                    <option key={key} value={key}>{config.label}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <button
                                                onClick={() => setEditingCell({ taskId: task.id, field: 'priority' })}
                                                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                                                    PRIORITY_CONFIG[task.priority]?.bg || 'bg-gray-50'
                                                } ${PRIORITY_CONFIG[task.priority]?.color || 'text-gray-600'}`}
                                            >
                                                <span>{PRIORITY_CONFIG[task.priority]?.icon || '⚪'}</span>
                                                {PRIORITY_CONFIG[task.priority]?.label || task.priority}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {getModuleName(task.module_id)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        {task.users ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs text-white font-medium">
                                                    {task.users.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-xs text-gray-600">{task.users.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {task.deadline ? (
                                            <div className={`flex items-center gap-1.5 text-xs ${
                                                new Date(task.deadline) < new Date() ? 'text-red-600' : 'text-gray-600'
                                            }`}>
                                                <FontAwesomeIcon icon={faCalendar} size="xs" />
                                                {new Date(task.deadline).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">No due date</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setShowActionsMenu(showActionsMenu === task.id ? null : task.id)
                                            }}
                                            className={`p-1 rounded hover:bg-gray-200 transition-opacity ${
                                                hoveredRow === task.id || showActionsMenu === task.id ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        >
                                            <FontAwesomeIcon icon={faEllipsisV} size="xs" className="text-gray-400" />
                                        </button>
                                        {showActionsMenu === task.id && renderActionsMenu(task)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {filteredTasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-gray-400" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">No tasks found</h3>
                            <p className="text-xs text-gray-500 mb-4">
                                {searchQuery ? 'Try adjusting your search or filters' : 'Create your first task to get started'}
                            </p>
                            <button
                                onClick={onCreateTask}
                                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                <FontAwesomeIcon icon={faPlus} size="xs" />
                                New Task
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Board View - Kanban */}
            {viewMode === 'board' && (
                <div className="flex gap-4 p-4 overflow-x-auto bg-gray-100 min-h-[500px]">
                    {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                        const statusTasks = filteredTasks.filter(t => t.status === status)
                        return (
                            <div key={status} className="flex-shrink-0 w-72 bg-gray-200 rounded-lg p-3">
                                <div className={`flex items-center justify-between mb-3 px-2 py-1.5 rounded-md ${config.color}`}>
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={config.icon} size="xs" />
                                        <span className="text-xs font-semibold">{config.label}</span>
                                    </div>
                                    <span className="text-xs font-bold">{statusTasks.length}</span>
                                </div>
                                <div className="space-y-2">
                                    {statusTasks.map(task => (
                                        <div
                                            key={task.id}
                                            className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer relative"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="text-sm font-medium text-gray-900 flex-1">{task.title}</h4>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setShowActionsMenu(showActionsMenu === task.id ? null : task.id)
                                                    }}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <FontAwesomeIcon icon={faEllipsisV} size="xs" />
                                                </button>
                                                {showActionsMenu === task.id && renderActionsMenu(task)}
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-xs px-1.5 py-0.5 rounded ${
                                                    PRIORITY_CONFIG[task.priority]?.bg || 'bg-gray-100'
                                                } ${PRIORITY_CONFIG[task.priority]?.color || 'text-gray-600'}`}>
                                                    {PRIORITY_CONFIG[task.priority]?.icon} {task.priority}
                                                </span>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                                    {getModuleName(task.module_id)}
                                                </span>
                                            </div>
                                            {task.deadline && (
                                                <div className={`flex items-center gap-1 text-xs ${
                                                    new Date(task.deadline) < new Date() ? 'text-red-600' : 'text-gray-500'
                                                }`}>
                                                    <FontAwesomeIcon icon={faCalendar} size="xs" />
                                                    {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </div>
                                            )}
                                            {task.users && (
                                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                                                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[10px] text-white font-medium">
                                                        {task.users.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-[10px] text-gray-600">{task.users.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="divide-y divide-gray-100">
                    {filteredTasks.map(task => (
                        <div
                            key={task.id}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors relative"
                        >
                            <input
                                type="checkbox"
                                checked={selectedTasks.has(task.id)}
                                onChange={() => toggleTaskSelection(task.id)}
                                className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <FontAwesomeIcon
                                icon={task.status === 'done' ? faCheckCircle : faCircle}
                                className={`text-sm ${
                                    task.status === 'done' ? 'text-green-500' : 'text-gray-300'
                                }`}
                            />
                            <span className={`flex-1 text-sm ${
                                task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'
                            }`}>
                                {task.title}
                            </span>
                            <div className="flex items-center gap-3">
                                {task.users && (
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[10px] text-white font-medium" title={task.users.name}>
                                            {task.users.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                )}
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    STATUS_CONFIG[task.status]?.color || 'bg-gray-100 text-gray-700'
                                }`}>
                                    {STATUS_CONFIG[task.status]?.label}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                    PRIORITY_CONFIG[task.priority]?.bg || 'bg-gray-100'
                                } ${PRIORITY_CONFIG[task.priority]?.color || 'text-gray-600'}`}>
                                    {PRIORITY_CONFIG[task.priority]?.icon} {task.priority}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowActionsMenu(showActionsMenu === task.id ? null : task.id)
                                    }}
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                >
                                    <FontAwesomeIcon icon={faEllipsisV} size="xs" />
                                </button>
                                {showActionsMenu === task.id && renderActionsMenu(task)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Task Modal */}
            {taskToEdit && (
                <EditTaskModal
                    task={taskToEdit}
                    modules={modules}
                    workspaceMembers={workspaceMembers}
                    onEditTask={handleEditTask}
                    onClose={() => setTaskToEdit(null)}
                />
            )}
        </div>
    )
}

export default TaskTable
