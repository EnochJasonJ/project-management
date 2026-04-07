import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faFolder, faFolderOpen,
    faCaretRight, faCaretDown,
    faThLarge, faTrash, faEllipsisV,
    faCheckCircle, faCircle, faClock, faFlag, faPlus
} from '@fortawesome/free-solid-svg-icons'
import fetchModules from '../utils/getModule'
import deleteModuleApi from '../utils/deleteModule'
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
    const [projectModules, setProjectModules] = useState({})

    useEffect(() => {
        const loadAllModules = async () => {
            if (!selectedWorkspace?.id) return;
            const modulesMap = {};
            for (const project of projects) {
                const fetchedModules = await fetchModules(project.id, selectedWorkspace.id);
                modulesMap[project.id] = fetchedModules || [];
            }
            setProjectModules(modulesMap);
            if (selectedProject?.id) {
                setModules(modulesMap[selectedProject.id] || []);
            }
        };
        if (projects.length > 0) {
            loadAllModules();
        }
    }, [selectedWorkspace?.id, projects.map(p => p.id).join(',')]);

    useEffect(() => {
        if (selectedProject?.id && projectModules[selectedProject.id]) {
            setModules(projectModules[selectedProject.id]);
        }
    }, [selectedProject?.id, projectModules]);

    useEffect(() => {
        setTasks([])
        setExpandedModules({})
    }, [selectedProject?.id])

    const deleteModule = async (module_id) => {
        await deleteModuleApi(module_id);
        setModules(prev => prev.filter(m => m.id !== module_id));
    }

    const toggleModule = async (e, module) => {
        e.stopPropagation();
        setSelectedModule(module);
        const isCurrentlyExpanded = !!expandedModules[module.id];
        setExpandedModules(prev => ({
            ...prev,
            [module.id]: !isCurrentlyExpanded
        }));
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

    const getTaskStatusIcon = (status) => {
        switch(status?.toLowerCase()) {
            case 'done':
            case 'completed':
                return { icon: faCheckCircle, color: 'text-green-400' }
            case 'in progress':
                return { icon: faClock, color: 'text-blue-400' }
            default:
                return { icon: faCircle, color: 'text-enterprise-muted' }
        }
    }

    return (
        <div className='flex flex-col w-full space-y-0.5'>
            {projects.map((project) => {
                const isProjectSelected = selectedProject?.id === project.id
                const projectModuleList = projectModules[project.id] || []
                const showModules = isProjectSelected && isExpanded

                return (
                    <React.Fragment key={project.id}>
                        <div
                            onMouseEnter={() => setHoveredItem(`project-${project.id}`)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => setSelectedProject(project)}
                            className={`group flex items-center gap-2.5 px-3 py-2 rounded transition-all cursor-pointer ${
                                isProjectSelected
                                    ? "bg-white/10 text-white"
                                    : "text-enterprise-muted hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <FontAwesomeIcon
                                icon={isProjectSelected ? (isExpanded ? faCaretDown : faCaretRight) : faCaretRight}
                                className={`text-[10px] w-3 transition-opacity ${isProjectSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                            />

                            <FontAwesomeIcon
                                icon={isProjectSelected ? faFolderOpen : faFolder}
                                className={isProjectSelected ? 'text-blue-400' : 'text-enterprise-muted'}
                                size="sm"
                            />

                            <span className="text-xs font-medium truncate flex-1 tracking-tight">
                                {project.name}
                            </span>

                            {hoveredItem === `project-${project.id}` && (
                                <FontAwesomeIcon icon={faEllipsisV} className="text-[10px] opacity-40 hover:opacity-100 p-1" />
                            )}
                        </div>

                        {showModules && (
                            <div className='ml-4 border-l border-white/5 space-y-0.5 mt-0.5'>
                                {projectModuleList.map((module) => {
                                    const isModuleSelected = selectedModule?.id === module.id;
                                    const isModuleExpanded = !!expandedModules[module.id];
                                    const moduleTasks = tasks.filter(t => t.module_id === module.id);

                                    return (
                                        <div key={module.id} className="flex flex-col">
                                            <div
                                                onMouseEnter={() => setHoveredItem(`module-${module.id}`)}
                                                onMouseLeave={() => setHoveredItem(null)}
                                                onClick={(e) => toggleModule(e, module)}
                                                className={`group flex items-center gap-2 py-1.5 px-3 ml-2 rounded cursor-pointer transition-all ${
                                                    isModuleSelected
                                                        ? "bg-white/5 text-white"
                                                        : "text-enterprise-muted hover:text-white hover:bg-white/5"
                                                }`}
                                            >
                                                <FontAwesomeIcon
                                                    icon={isModuleExpanded ? faCaretDown : faCaretRight}
                                                    className="text-[8px] opacity-40"
                                                />
                                                <FontAwesomeIcon
                                                    icon={faThLarge}
                                                    className={`text-[10px] ${isModuleSelected ? 'text-blue-400' : 'opacity-40'}`}
                                                />
                                                <span className="text-[11px] font-medium flex-1 truncate">
                                                    {module.name}
                                                </span>
                                                {hoveredItem === `module-${module.id}` && (
                                                    <FontAwesomeIcon icon={faTrash} className="text-[10px] text-red-400/60 hover:text-red-400" onClick={(e) => { e.stopPropagation(); deleteModule(module.id); }} />
                                                )}
                                            </div>

                                            {isModuleExpanded && (
                                                <div className='ml-8 space-y-0.5 py-1'>
                                                    {moduleTasks.map(task => {
                                                        const statusInfo = getTaskStatusIcon(task.status);
                                                        return (
                                                            <div
                                                                key={task.id}
                                                                className="flex items-center gap-2 py-1 px-2 text-[10px] text-enterprise-muted hover:text-white transition-colors cursor-default"
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={statusInfo.icon}
                                                                    className={statusInfo.color}
                                                                />
                                                                <span className="truncate flex-1">{task.title}</span>
                                                            </div>
                                                        )
                                                    })}
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
