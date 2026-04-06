import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faFolder, faFolderOpen,
    faCaretRight, faCaretDown,
    faThLarge, faTrash, faEllipsisV,
    faCheckCircle, faCircle, faClock, faFlag, faPlus
} from '@fortawesome/free-solid-svg-icons'
import fetchModules from '../utils/getModule'
import { supabase } from '../utils/supabaseClient'
import deleteModule from '../utils/deleteModule'
import fetchTasks from '../utils/getTasks'

function ListProjects({
    projects, selectedProject, setSelectedProject,
    modules, setModules,
    selectedWorkspace,
    selectedModule, setSelectedModule,
    tasks, setTasks
}) {
    const [isExpanded, setIsExpanded] = useState(true)
    const [expandedModules, setExpandedModules] = useState({})
    const [hoveredItem, setHoveredItem] = useState(null)
    // Store modules per project: { [projectId]: [modules] }
    const [projectModules, setProjectModules] = useState({})

    // Load modules for ALL projects in the workspace
    useEffect(() => {
        const loadAllModules = async () => {
            if (!selectedWorkspace?.id) return;

            const modulesMap = {};
            for (const project of projects) {
                const fetchedModules = await fetchModules(project.id, selectedWorkspace.id);
                modulesMap[project.id] = fetchedModules || [];
            }
            setProjectModules(modulesMap);

            // Also update the flat modules list for compatibility
            if (selectedProject?.id) {
                setModules(modulesMap[selectedProject.id] || []);
            }
        };

        if (projects.length > 0) {
            loadAllModules();
        }
    }, [selectedWorkspace?.id, projects.map(p => p.id).join(',')]);

    // Update modules when selected project changes
    useEffect(() => {
        if (selectedProject?.id && projectModules[selectedProject.id]) {
            setModules(projectModules[selectedProject.id]);
        }
    }, [selectedProject?.id, projectModules]);

    // Cleanup tasks when project changes
    useEffect(() => {
        setTasks([])
        setExpandedModules({})
    }, [selectedProject?.id])

    const deleteModule = async (module_id) => {
        await deleteModule(module_id);
        setModules(prev => prev.filter(m => m.id !== module_id));
    }

    // Toggle module expansion and fetch tasks if needed
    const toggleModule = async (e, module) => {
        e.stopPropagation();
        setSelectedModule(module);

        const isCurrentlyExpanded = !!expandedModules[module.id];
        setExpandedModules(prev => ({
            ...prev,
            [module.id]: !isCurrentlyExpanded
        }));

        // Fetch tasks if expanding
        if (!isCurrentlyExpanded) {
            const fetchedTasks = await fetchTasks(module.id);
            if (fetchedTasks && fetchedTasks.length > 0) {
                setTasks(prev => {
                    const uniqueTasksMap = new Map(prev.map(t => [t.id, t]));
                    fetchedTasks.forEach(t => uniqueTasksMap.set(t.id, t));
                    return Array.from(uniqueTasksMap.values());
                });
            }
        }
    }

    // Helper: Get task status icon
    const getTaskStatusIcon = (status) => {
        switch(status?.toLowerCase()) {
            case 'done':
            case 'completed':
                return { icon: faCheckCircle, color: 'text-green-500' }
            case 'in progress':
                return { icon: faClock, color: 'text-amber-500' }
            case 'todo':
            default:
                return { icon: faCircle, color: 'text-gray-300' }
        }
    }

    // Helper: Get priority indicator
    const getPriorityIndicator = (priority) => {
        switch(priority?.toLowerCase()) {
            case 'high': return '🔴'
            case 'medium': return '🟡'
            case 'low': return '🟢'
            default: return '⚪'
        }
    }

    return (
        <div className='flex flex-col w-full'>
            {projects.map((project) => {
                const isProjectSelected = selectedProject?.id === project.id
                const projectModuleList = projectModules[project.id] || []
                const showModules = isProjectSelected && isExpanded
                const projectTotalTasks = tasks.filter(t => t.module_id && projectModuleList.some(m => m.id === t.module_id)).length
                const projectCompletedTasks = tasks.filter(t => t.module_id && projectModuleList.some(m => m.id === t.module_id) && t.status?.toLowerCase() === 'done').length

                return (
                    <React.Fragment key={project.id}>
                        {/* Project Header - Notion-style */}
                        <div
                            onMouseEnter={() => setHoveredItem(`project-${project.id}`)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => setSelectedProject(project)}
                            className={`group flex flex-row items-center gap-2 px-3 py-2.5 mx-1 mb-1 rounded-md cursor-pointer transition-all duration-150 ${
                                isProjectSelected
                                    ? "bg-gray-100 border-l-2 border-gray-800"
                                    : "hover:bg-gray-50 border-l-2 border-transparent"
                            }`}
                        >
                            {/* Expand/Collapse */}
                            <div className="w-4 flex-shrink-0">
                                {isProjectSelected ? (
                                    <FontAwesomeIcon
                                        icon={isExpanded ? faCaretDown : faCaretRight}
                                        size="xs"
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    />
                                ) : null}
                            </div>

                            {/* Project Icon */}
                            <FontAwesomeIcon
                                icon={isProjectSelected ? faFolderOpen : faFolder}
                                className={`transition-colors ${
                                    isProjectSelected ? 'text-gray-700' : 'text-gray-400 group-hover:text-gray-600'
                                }`}
                                size="sm"
                            />

                            {/* Project Name */}
                            <span className={`text-sm font-medium truncate flex-1 ${
                                isProjectSelected ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                                {project.name}
                            </span>

                            {/* Progress Badge - Jira-style */}
                            {projectTotalTasks > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-gray-400">
                                        {projectCompletedTasks}/{projectTotalTasks}
                                    </span>
                                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-300"
                                            style={{ width: `${(projectCompletedTasks / projectTotalTasks) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Module Count - Show for each project */}
                            {projectModuleList.length > 0 && (
                                <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                                    {projectModuleList.length}
                                </span>
                            )}

                            {/* Add Module Button */}
                            {isProjectSelected && hoveredItem === `project-${project.id}` && (
                                <button className="p-1 hover:bg-gray-200 rounded transition-all">
                                    <FontAwesomeIcon icon={faPlus} size="xs" className="text-gray-500" />
                                </button>
                            )}

                            {/* Actions Menu */}
                            {hoveredItem === `project-${project.id}` && (
                                <button className="p-1 hover:bg-gray-200 rounded transition-all">
                                    <FontAwesomeIcon icon={faEllipsisV} size="xs" className="text-gray-400" />
                                </button>
                            )}
                        </div>

                        {/* Modules List - Notion-style nested - Show each project's own modules */}
                        {showModules && (
                            <div className='ml-2 mt-0.5 space-y-0.5'>
                                {projectModuleList.map((module) => {
                                    const isModuleSelected = selectedModule?.id === module.id;
                                    const isModuleExpanded = !!expandedModules[module.id];
                                    const moduleTasks = tasks.filter(t => t.module_id === module.id);
                                    const moduleCompleted = moduleTasks.filter(t => t.status?.toLowerCase() === 'done').length;

                                    return (
                                        <div key={module.id} className="flex flex-col">
                                            {/* Module Row */}
                                            <div
                                                onMouseEnter={() => setHoveredItem(`module-${module.id}`)}
                                                onMouseLeave={() => setHoveredItem(null)}
                                                onClick={(e) => toggleModule(e, module)}
                                                className={`group flex items-center gap-2 py-1.5 px-3 ml-2 rounded-md cursor-pointer transition-all duration-150 ${
                                                    isModuleSelected
                                                        ? "bg-indigo-50 border-l-2 border-indigo-500"
                                                        : "hover:bg-gray-50 border-l-2 border-transparent"
                                                }`}
                                            >
                                                {/* Expand Icon */}
                                                <FontAwesomeIcon
                                                    icon={isModuleExpanded ? faCaretDown : faCaretRight}
                                                    size="xs"
                                                    className={`text-gray-400 transition-transform duration-150 ${
                                                        isModuleExpanded ? 'rotate-0' : '-rotate-90'
                                                    }`}
                                                />

                                                {/* Module Icon */}
                                                <FontAwesomeIcon
                                                    icon={faThLarge}
                                                    className={`text-xs ${
                                                        isModuleSelected ? 'text-indigo-500' : 'text-gray-400'
                                                    }`}
                                                />

                                                {/* Module Name */}
                                                <span className={`text-xs font-medium flex-1 truncate ${
                                                    isModuleSelected ? 'text-indigo-700' : 'text-gray-600'
                                                }`}>
                                                    {module.name}
                                                </span>

                                                {/* Task Count */}
                                                {moduleTasks.length > 0 && (
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                                        isModuleSelected
                                                            ? 'bg-indigo-100 text-indigo-600'
                                                            : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {moduleCompleted}/{moduleTasks.length}
                                                    </span>
                                                )}

                                                {/* Delete Button */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteModule(module.id); }}
                                                    className={`p-1 rounded transition-all ${
                                                        hoveredItem === `module-${module.id}`
                                                            ? 'opacity-100 hover:bg-red-100 hover:text-red-500'
                                                            : 'opacity-0'
                                                    }`}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} size="xs" />
                                                </button>
                                            </div>

                                            {/* Tasks List - Jira-style */}
                                            {isModuleExpanded && (
                                                <div className='ml-6 mt-0.5 mb-1 space-y-0.5'>
                                                    {moduleTasks.length > 0 ? (
                                                        moduleTasks.map(task => {
                                                            const statusInfo = getTaskStatusIcon(task.status);
                                                            const priority = getPriorityIndicator(task.priority);

                                                            return (
                                                                <div
                                                                    key={task.id}
                                                                    className="group flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-50 cursor-pointer transition-all"
                                                                >
                                                                    {/* Status Icon */}
                                                                    <FontAwesomeIcon
                                                                        icon={statusInfo.icon}
                                                                        className={`text-[10px] ${statusInfo.color}`}
                                                                    />

                                                                    {/* Priority */}
                                                                    <span className="text-[10px]" title={`Priority: ${task.priority}`}>
                                                                        {priority}
                                                                    </span>

                                                                    {/* Task Title */}
                                                                    <span
                                                                        className="text-[12px] text-gray-700 truncate flex-1"
                                                                        title={task.description || task.title}
                                                                    >
                                                                        {task.title}
                                                                    </span>

                                                                    {/* Assignee Avatar (placeholder) */}
                                                                    {task.assigned_to && (
                                                                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[8px] text-white font-medium">
                                                                            {task.assigned_to?.charAt(0).toUpperCase()}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )
                                                        })
                                                    ) : (
                                                        <div className='py-2 px-3 text-[11px] text-gray-400 italic bg-gray-50 rounded-md'>
                                                            <span className="flex items-center gap-1.5">
                                                                <FontAwesomeIcon icon={faCircle} size="xs" />
                                                                No tasks yet — click to add one
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </React.Fragment>
                )
            })}
        </div>
    )
}

export default ListProjects;
