import React, { useState, useEffect, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus, faSearch, faFilter, faSort, faSortUp, faSortDown,
    faGripVertical, faTable, faThLarge, faList, faEllipsisV,
    faCheckCircle, faCircle, faClock, faExclamationCircle,
    faFlag, faCalendar, faUser, faChevronDown, faArrowUpWideShort, faPen, faTrash
} from '@fortawesome/free-solid-svg-icons'
import EditTaskModal from './EditTaskModal'

// Status configuration
const STATUS_CONFIG = {
    'todo': { label: 'To Do', color: 'bg-slate-100 text-slate-700 border border-slate-200', icon: faCircle },
    'in progress': { label: 'In Progress', color: 'bg-blue-50 text-blue-700 border border-blue-100', icon: faClock },
    'done': { label: 'Done', color: 'bg-green-50 text-green-700 border border-green-100', icon: faCheckCircle },
    'blocked': { label: 'Blocked', color: 'bg-red-50 text-red-700 border border-red-100', icon: faExclamationCircle }
}

// Priority configuration
const PRIORITY_CONFIG = {
    'high': { label: 'High', color: 'text-red-600', bg: 'bg-red-50', icon: '🔴' },
    'medium': { label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50', icon: '🟡' },
    'low': { label: 'Low', color: 'text-green-600', bg: 'bg-green-50', icon: '🟢' }
}

function TaskTable({ tasks, setTasks, modules, selectedProject, selectedWorkspace, workspaceMembers, onCreateTask, onEditTask }) {
    const [viewMode, setViewMode] = useState('table')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' })
    const [filterConfig, setFilterConfig] = useState({ status: [], priority: [], assignee: [] })
    const [showFilters, setShowFilters] = useState(false)
    const [selectedTasks, setSelectedTasks] = useState(new Set())
    const [editingCell, setEditingCell] = useState(null) // { taskId, field }
    const [hoveredRow, setHoveredRow] = useState(null)
    const [taskToEdit, setTaskToEdit] = useState(null)
    const [showActionsMenu, setShowActionsMenu] = useState(null)

    const filteredTasks = useMemo(() => {
        let result = [...tasks]
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(task =>
                task.title?.toLowerCase().includes(query) ||
                task.description?.toLowerCase().includes(query)
            )
        }
        if (filterConfig.status.length > 0) result = result.filter(task => filterConfig.status.includes(task.status))
        if (filterConfig.priority.length > 0) result = result.filter(task => filterConfig.priority.includes(task.priority))
        result.sort((a, b) => {
            let aVal = a[sortConfig.key]; let bVal = b[sortConfig.key];
            if (sortConfig.key === 'priority') {
                const priorityOrder = { high: 0, medium: 1, low: 2 }
                aVal = priorityOrder[a.priority] || 3; bVal = priorityOrder[b.priority] || 3;
            }
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })
        return result
    }, [tasks, searchQuery, sortConfig, filterConfig])

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    const updateTaskStatus = async (taskId, newStatus) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            })
            if (response.ok) {
                const updated = await response.json()
                setTasks(prev => prev.map(t => t.id === taskId ? updated : t))
            }
        } catch (error) { console.error('Failed to update task:', error) }
        setEditingCell(null)
    }

    const updateTaskPriority = async (taskId, newPriority) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ priority: newPriority })
            })
            if (response.ok) {
                const updated = await response.json()
                setTasks(prev => prev.map(t => t.id === taskId ? updated : t))
            }
        } catch (error) { console.error('Failed to update task:', error) }
        setEditingCell(null)
    }

    const updateTaskAssignee = async (taskId, newAssigneeId) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ assigned_to: newAssigneeId || null })
            })
            if (response.ok) {
                const updated = await response.json()
                setTasks(prev => prev.map(t => t.id === taskId ? updated : t))
            }
        } catch (error) { console.error('Failed to update task assignee:', error) }
        setEditingCell(null)
    }

    const toggleTaskSelection = (taskId) => {
        setSelectedTasks(prev => {
            const newSet = new Set(prev)
            if (newSet.has(taskId)) newSet.delete(taskId)
            else newSet.add(taskId)
            return newSet
        })
    }

    const getModuleName = (moduleId) => modules.find(m => m.id === moduleId)?.name || 'No Module'

    const handleEditTask = async (taskId, taskData) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(taskData)
            })
            if (response.ok) {
                const updated = await response.json()
                setTasks(prev => prev.map(t => t.id === taskId ? updated : t))
                setTaskToEdit(null)
            }
        } catch (error) { console.error('Failed to update task:', error) }
    }

    const handleDeleteTask = async (taskId, skipConfirm = false) => {
        if (!skipConfirm && !window.confirm('Are you sure you want to delete this task?')) return
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                setTasks(prev => prev.filter(t => t.id !== taskId))
                setSelectedTasks(prev => { const n = new Set(prev); n.delete(taskId); return n; })
            }
        } catch (error) { console.error('Failed to delete task:', error) }
    }

    const handleBulkDeleteTasks = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedTasks.size} task(s)?`)) return
        for (const taskId of selectedTasks) await handleDeleteTask(taskId, true)
        setSelectedTasks(new Set())
    }

    const handleBulkMarkAsDone = async () => {
        for (const taskId of selectedTasks) await updateTaskStatus(taskId, 'done')
        setSelectedTasks(new Set())
    }

    useEffect(() => {
        const h = () => setShowActionsMenu(null)
        if (showActionsMenu) { document.addEventListener('click', h); return () => document.removeEventListener('click', h) }
    }, [showActionsMenu])

    const getSortIcon = (k) => sortConfig.key !== k ? faSort : (sortConfig.direction === 'asc' ? faSortUp : faSortDown)

    const renderActionsMenu = (task) => (
        <div className="absolute right-0 top-8 z-30 bg-white rounded shadow-xl border border-enterprise-muted/20 py-1 w-40 overflow-hidden">
            <button onClick={(e) => { e.stopPropagation(); setTaskToEdit(task); setShowActionsMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-enterprise-dark hover:bg-enterprise-light transition-colors">
                <FontAwesomeIcon icon={faPen} className="text-enterprise-muted" />
                Edit Task
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); setShowActionsMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
                <FontAwesomeIcon icon={faTrash} />
                Delete Task
            </button>
        </div>
    )

    return (
        <div className="bg-white rounded-lg shadow-sm border border-enterprise-muted/20 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-enterprise-muted/10 bg-white">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-enterprise-muted text-[10px]" />
                        <input type="text" placeholder="Search operational tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 pr-3 py-1.5 text-xs bg-white border border-enterprise-muted/30 rounded focus:outline-none focus:ring-1 focus:ring-enterprise-dark w-64 placeholder:text-enterprise-muted/50 font-medium text-enterprise-dark" />
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-all ${filterConfig.status.length > 0 || filterConfig.priority.length > 0 ? 'bg-enterprise-dark text-white border-enterprise-dark' : 'bg-white border-enterprise-muted/30 text-enterprise-muted hover:border-enterprise-dark'}`}><FontAwesomeIcon icon={faFilter} /> Filter</button>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-enterprise-light p-0.5 rounded border border-enterprise-muted/20">
                        {['table', 'board', 'list'].map(m => (
                            <button key={m} onClick={() => setViewMode(m)} className={`p-1.5 rounded transition-all ${viewMode === m ? 'bg-white text-enterprise-dark shadow-sm' : 'text-enterprise-muted hover:text-enterprise-dark'}`}>
                                <FontAwesomeIcon icon={m === 'table' ? faTable : (m === 'board' ? faThLarge : faList)} size="xs" />
                            </button>
                        ))}
                    </div>
                    <button onClick={onCreateTask} className="flex items-center gap-2 px-3 py-1.5 bg-enterprise-dark text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-enterprise-accent transition-all shadow-sm"><FontAwesomeIcon icon={faPlus} /> New Task</button>
                </div>
            </div>

            {selectedTasks.size > 0 && (
                <div className="flex items-center justify-between px-6 py-2 bg-enterprise-dark/5 text-enterprise-dark border-b border-enterprise-muted/20">
                    <span className="text-[10px] font-bold uppercase tracking-widest">{selectedTasks.size} Selected</span>
                    <div className="flex items-center gap-4">
                        <button className="text-[10px] font-bold uppercase tracking-widest hover:text-blue-600" onClick={handleBulkMarkAsDone}>Mark Completed</button>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:text-red-700" onClick={handleBulkDeleteTasks}>Purge Tasks</button>
                    </div>
                </div>
            )}

            {viewMode === 'table' && (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-enterprise-light border-b border-enterprise-muted/20">
                            <tr>
                                <th className="w-12 px-4 py-3 text-center"><input type="checkbox" checked={filteredTasks.length > 0 && selectedTasks.size === filteredTasks.length} onChange={(e) => e.target.checked ? setSelectedTasks(new Set(filteredTasks.map(t => t.id))) : setSelectedTasks(new Set())} className="rounded border-enterprise-muted/50 text-enterprise-dark focus:ring-enterprise-dark" /></th>
                                <th className="w-8"></th>
                                {['title', 'status', 'priority', 'module', 'assignee', 'deadline'].map(k => (
                                    <th key={k} className="px-4 py-3 text-left text-[10px] font-bold text-enterprise-muted uppercase tracking-widest cursor-pointer hover:bg-enterprise-muted/5 transition-colors" onClick={() => ['module', 'assignee'].includes(k) ? null : handleSort(k)}>
                                        <div className="flex items-center gap-2">{k.replace('_', ' ')} {!['module', 'assignee'].includes(k) && <FontAwesomeIcon icon={getSortIcon(k)} className="opacity-30 text-[8px]" />}</div>
                                    </th>
                                ))}
                                <th className="w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-enterprise-muted/10">
                            {filteredTasks.map((task) => (
                                <tr key={task.id} onMouseEnter={() => setHoveredRow(task.id)} onMouseLeave={() => setHoveredRow(null)} className={`group transition-colors ${selectedTasks.has(task.id) ? 'bg-blue-50/50' : 'hover:bg-enterprise-light/50'}`}>
                                    <td className="px-4 py-3 text-center"><input type="checkbox" checked={selectedTasks.has(task.id)} onChange={() => toggleTaskSelection(task.id)} className="rounded border-enterprise-muted/50 text-enterprise-dark focus:ring-enterprise-dark" /></td>
                                    <td className="text-center opacity-0 group-hover:opacity-100 transition-opacity"><FontAwesomeIcon icon={faGripVertical} className="text-enterprise-muted/30" size="xs" /></td>
                                    <td className="px-4 py-3"><div className="flex items-center gap-3"><FontAwesomeIcon icon={task.status === 'done' ? faCheckCircle : faCircle} className={`text-xs ${task.status === 'done' ? 'text-green-500' : 'text-enterprise-muted/30'}`} /><span className={`text-xs font-semibold ${task.status === 'done' ? 'line-through text-enterprise-muted/50' : 'text-enterprise-dark'}`}>{task.title}</span></div></td>
                                    
                                    <td className="px-4 py-3">
                                        {editingCell?.taskId === task.id && editingCell?.field === 'status' ? (
                                            <select
                                                value={task.status}
                                                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                                onBlur={() => setEditingCell(null)}
                                                autoFocus
                                                className="text-[10px] font-bold uppercase border border-enterprise-muted/30 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-enterprise-dark bg-white"
                                            >
                                                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                                    <option key={key} value={key}>{config.label}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setEditingCell({ taskId: task.id, field: 'status' }); }}
                                                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all hover:scale-105 ${STATUS_CONFIG[task.status]?.color}`}
                                            >
                                                {STATUS_CONFIG[task.status]?.label}
                                            </button>
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        {editingCell?.taskId === task.id && editingCell?.field === 'priority' ? (
                                            <select
                                                value={task.priority}
                                                onChange={(e) => updateTaskPriority(task.id, e.target.value)}
                                                onBlur={() => setEditingCell(null)}
                                                autoFocus
                                                className="text-[10px] font-bold uppercase border border-enterprise-muted/30 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-enterprise-dark bg-white"
                                            >
                                                {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                                                    <option key={key} value={key}>{config.label}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setEditingCell({ taskId: task.id, field: 'priority' }); }}
                                                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all hover:scale-105 border border-black/5 ${PRIORITY_CONFIG[task.priority]?.bg} ${PRIORITY_CONFIG[task.priority]?.color}`}
                                            >
                                                {PRIORITY_CONFIG[task.priority]?.label}
                                            </button>
                                        )}
                                    </td>

                                    <td className="px-4 py-3"><span className="text-[10px] font-medium text-enterprise-muted uppercase">{getModuleName(task.module_id)}</span></td>
                                    
                                    <td className="px-4 py-3">
                                        {editingCell?.taskId === task.id && editingCell?.field === 'assignee' ? (
                                            <select
                                                value={task.assigned_to || ''}
                                                onChange={(e) => updateTaskAssignee(task.id, e.target.value)}
                                                onBlur={() => setEditingCell(null)}
                                                autoFocus
                                                className="text-xs font-medium border border-enterprise-muted/30 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-enterprise-dark bg-white"
                                            >
                                                <option value="">Unassigned</option>
                                                {workspaceMembers.map(m => (
                                                    <option key={m.id} value={m.id}>{m.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setEditingCell({ taskId: task.id, field: 'assignee' }); }}
                                                className="flex items-center gap-2 hover:bg-enterprise-muted/5 p-1 rounded transition-colors"
                                            >
                                                {task.users ? (
                                                    <>
                                                        <div className="w-6 h-6 rounded-full bg-enterprise-dark flex items-center justify-center text-[9px] text-white font-bold">{task.users.name.charAt(0)}</div>
                                                        <span className="text-xs font-medium text-enterprise-dark">{task.users.name}</span>
                                                    </>
                                                ) : <span className="text-xs font-medium text-enterprise-muted/40 italic">None</span>}
                                            </button>
                                        )}
                                    </td>

                                    <td className="px-4 py-3">{task.deadline ? <div className={`text-[10px] font-bold uppercase tracking-widest ${new Date(task.deadline) < new Date() ? 'text-red-600' : 'text-enterprise-muted'}`}>{new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div> : <span className="text-[10px] font-bold text-enterprise-muted/20">---</span>}</td>
                                    <td className="px-4 py-3 relative"><button onClick={(e) => { e.stopPropagation(); setShowActionsMenu(showActionsMenu === task.id ? null : task.id); }} className={`p-1 rounded hover:bg-enterprise-muted/10 transition-all ${hoveredRow === task.id || showActionsMenu === task.id ? 'opacity-100' : 'opacity-0'}`}><FontAwesomeIcon icon={faEllipsisV} className="text-enterprise-muted" size="xs" /></button>{showActionsMenu === task.id && renderActionsMenu(task)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {viewMode === 'board' && (
                <div className="flex gap-6 p-6 overflow-x-auto bg-enterprise-light/30 min-h-[600px]">
                    {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                        const statusTasks = filteredTasks.filter(t => t.status === status)
                        return (
                            <div key={status} className="flex-shrink-0 w-72">
                                <div className={`flex items-center justify-between mb-4 px-3 py-2 rounded-md border-b-2 border-enterprise-muted shadow-sm ${config.color}`}><div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]"><FontAwesomeIcon icon={config.icon} /><span>{config.label}</span></div><span className="text-[9px] font-black">{statusTasks.length}</span></div>
                                <div className="space-y-3">
                                    {statusTasks.map(task => (
                                        <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm border border-enterprise-muted/10 hover:border-enterprise-muted/30 transition-all cursor-pointer relative group">
                                            <div className="flex items-start justify-between mb-3"><h4 className={`text-xs font-bold text-enterprise-dark leading-tight tracking-tight ${task.status === 'done' ? 'line-through opacity-30' : ''}`}>{task.title}</h4><button onClick={(e) => { e.stopPropagation(); setShowActionsMenu(showActionsMenu === task.id ? null : task.id); }} className="text-enterprise-muted/30 hover:text-enterprise-dark opacity-0 group-hover:opacity-100 transition-opacity p-1"><FontAwesomeIcon icon={faEllipsisV} size="xs" /></button>{showActionsMenu === task.id && renderActionsMenu(task)}</div>
                                            <div className="flex flex-wrap gap-2 mb-4"><span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-widest ${PRIORITY_CONFIG[task.priority]?.bg} ${PRIORITY_CONFIG[task.priority]?.color}`}>{PRIORITY_CONFIG[task.priority]?.label}</span><span className="text-[8px] font-black text-enterprise-muted/60 bg-enterprise-light px-1.5 py-0.5 rounded border uppercase tracking-widest">{getModuleName(task.module_id)}</span></div>
                                            <div className="flex items-center justify-between pt-3 border-t border-enterprise-light">{task.deadline ? <div className="flex items-center gap-1 text-[8px] font-bold text-enterprise-muted uppercase tracking-widest"><FontAwesomeIcon icon={faCalendar} className="text-enterprise-muted/50" /> {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div> : <div></div>}{task.users && <div className="w-6 h-6 rounded-full bg-enterprise-dark flex items-center justify-center text-[8px] text-white font-bold">{task.users.name.charAt(0)}</div>}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {viewMode === 'list' && (
                <div className="divide-y divide-enterprise-muted/10">
                    {filteredTasks.map(task => (
                        <div key={task.id} className="flex items-center gap-4 px-6 py-3 hover:bg-enterprise-light/30 transition-all group relative text-xs">
                            <input type="checkbox" checked={selectedTasks.has(task.id)} onChange={() => toggleTaskSelection(task.id)} className="rounded border-enterprise-muted/50 text-enterprise-dark focus:ring-enterprise-dark" />
                            <FontAwesomeIcon icon={task.status === 'done' ? faCheckCircle : faCircle} className={`text-xs ${task.status === 'done' ? 'text-green-500' : 'text-enterprise-muted/20'}`} />
                            <span className={`flex-1 font-bold ${task.status === 'done' ? 'line-through text-enterprise-muted/30' : 'text-enterprise-dark'}`}>{task.title}</span>
                            <div className="flex items-center gap-4">{task.users && <div className="w-6 h-6 rounded-full bg-enterprise-dark flex items-center justify-center text-[8px] text-white font-bold">{task.users.name.charAt(0)}</div>}<span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${STATUS_CONFIG[task.status]?.color}`}>{STATUS_CONFIG[task.status]?.label}</span><button onClick={(e) => { e.stopPropagation(); setShowActionsMenu(showActionsMenu === task.id ? null : task.id); }} className="text-enterprise-muted/30 hover:text-enterprise-dark p-1 rounded hover:bg-enterprise-light transition-all opacity-0 group-hover:opacity-100"><FontAwesomeIcon icon={faEllipsisV} size="xs" /></button>{showActionsMenu === task.id && renderActionsMenu(task)}</div>
                        </div>
                    ))}
                </div>
            )}

            {taskToEdit && <EditTaskModal task={taskToEdit} modules={modules} workspaceMembers={workspaceMembers} onEditTask={handleEditTask} onClose={() => setTaskToEdit(null)} />}
        </div>
    )
}

export default TaskTable
