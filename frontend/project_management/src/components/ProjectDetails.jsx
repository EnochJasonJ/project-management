import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faTasks, faUsers, faClock, faPlus, faCheckCircle, faLayerGroup, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import TaskTable from './TaskTable'
import CreateTaskModal from './CreateTaskModal'

function ProjectDetails({
  selectedProject,
  onUpdateProject,
  modules,
  tasks,
  setTasks,
  selectedWorkspace,
  workspaceMembers,
  createTask,
  onCreateModule
}) {
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [isEditingPriority, setIsEditingPriority] = useState(false)

  if (!selectedProject) {
    return (
      <div className="ml-64 flex-1 flex items-center justify-center bg-enterprise-light">
        <div className="text-center p-12">
          <div className="w-20 h-20 bg-white shadow-sm border border-enterprise-muted/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faFolder} className="text-2xl text-enterprise-muted" />
          </div>
          <h2 className="text-lg font-bold text-enterprise-dark tracking-tight">Project Dashboard</h2>
          <p className="text-enterprise-muted text-sm mt-1">Select a project from the sidebar to view metrics</p>
        </div>
      </div>
    )
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'done').length
  const inProgressTasks = tasks.filter(t => t.status === 'in progress').length

  const handlePriorityChange = async (newPriority) => {
    await onUpdateProject(selectedProject.id, { priority: newPriority })
    setIsEditingPriority(false)
  }

  return (
    <div className="ml-64 flex-1 min-h-screen bg-enterprise-light p-8 overflow-y-auto">
      {showTaskModal && (
        <CreateTaskModal
          modules={modules}
          workspaceMembers={workspaceMembers}
          workspaceId={selectedWorkspace.id}
          defaultPriority={selectedProject.priority}
          onCreateTask={(taskData) => {
            createTask(taskData)
            setShowTaskModal(false)
          }}
          onClose={() => setShowTaskModal(false)}
        />
      )}

      {/* Header Card */}
      <div className="mb-8 bg-white border border-enterprise-muted/20 shadow-sm rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-enterprise-dark rounded-lg flex items-center justify-center shadow-md">
              <FontAwesomeIcon icon={faFolder} className="text-white text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-enterprise-dark tracking-tight">
                  {selectedProject.name}
                </h1>
                <span className="bg-enterprise-light text-enterprise-dark text-[10px] font-bold px-2 py-0.5 rounded border border-enterprise-muted/30 uppercase tracking-wider">
                  {selectedProject.status}
                </span>
              </div>
              <p className="text-enterprise-muted text-xs font-medium mt-0.5">{selectedProject.description || 'No project description provided.'}</p>
            </div>
          </div>
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-enterprise-dark text-white rounded-md hover:bg-enterprise-accent transition-all shadow-sm text-xs font-bold uppercase tracking-widest"
          >
            <FontAwesomeIcon icon={faPlus} />
            Create Task
          </button>
        </div>

        <div className="flex items-center gap-6 border-t border-enterprise-muted/10 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-enterprise-muted uppercase tracking-wider">Priority</span>
            {isEditingPriority ? (
              <select
                value={selectedProject.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                onBlur={() => setIsEditingPriority(false)}
                autoFocus
                className="text-[10px] font-bold uppercase border border-enterprise-muted/30 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-enterprise-dark bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            ) : (
              <button 
                onClick={() => setIsEditingPriority(true)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all hover:scale-105 ${
                  selectedProject.priority === 'high' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-enterprise-light text-enterprise-dark border border-enterprise-muted/20'
                }`}
              >
                {selectedProject.priority.toUpperCase()}
              </button>
            )}
          </div>
          
          {selectedProject.due_date && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="text-enterprise-muted text-[10px]" />
              <span className="text-[10px] font-bold text-enterprise-muted uppercase tracking-widest">
                Due: {new Date(selectedProject.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tasks', value: totalTasks, icon: faTasks, color: 'text-enterprise-dark', bg: 'bg-white' },
          { label: 'In Progress', value: inProgressTasks, icon: faClock, color: 'text-blue-600', bg: 'bg-white' },
          { label: 'Completed', value: completedTasks, icon: faCheckCircle, color: 'text-green-600', bg: 'bg-white' },
          { label: 'Modules', value: modules.length, icon: faUsers, color: 'text-enterprise-muted', bg: 'bg-white' }
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-5 rounded-xl border border-enterprise-muted/20 shadow-sm flex items-center gap-4`}>
            <div className="w-10 h-10 bg-enterprise-light rounded-lg flex items-center justify-center border border-enterprise-muted/10">
              <FontAwesomeIcon icon={stat.icon} className={`${stat.color} text-sm`} />
            </div>
            <div>
              <p className="text-xl font-bold text-enterprise-dark leading-none">{stat.value}</p>
              <p className="text-[10px] font-black text-enterprise-muted uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      {modules.length === 0 ? (
        <div className="bg-white rounded-xl border border-enterprise-muted/20 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-enterprise-light rounded-full flex items-center justify-center mx-auto mb-6 border border-enterprise-muted/10">
            <FontAwesomeIcon icon={faLayerGroup} className="text-xl text-enterprise-muted" />
          </div>
          <h3 className="text-lg font-bold text-enterprise-dark uppercase tracking-tight mb-2">Project Architecture</h3>
          <p className="text-enterprise-muted text-sm mb-8 max-w-xs mx-auto font-medium">
            Define your project modules to begin structured task management.
          </p>
          <button
            onClick={onCreateModule}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-enterprise-dark text-white font-bold rounded-md hover:bg-enterprise-accent transition-all shadow-sm uppercase text-[10px] tracking-[0.2em]"
          >
            <FontAwesomeIcon icon={faPlus} />
            Initialize Module
          </button>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-enterprise-muted/20 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-enterprise-light rounded-full flex items-center justify-center mx-auto mb-6 border border-enterprise-muted/10">
            <FontAwesomeIcon icon={faTasks} className="text-xl text-enterprise-muted" />
          </div>
          <h3 className="text-lg font-bold text-enterprise-dark uppercase tracking-tight mb-2">Roadmap Planning</h3>
          <p className="text-enterprise-muted text-sm mb-8 max-w-xs mx-auto font-medium">
            Project modules defined. Proceed to add operational tasks.
          </p>
          <button
            onClick={() => setShowTaskModal(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-enterprise-dark text-white font-bold rounded-md hover:bg-enterprise-accent transition-all shadow-sm uppercase text-[10px] tracking-[0.2em]"
          >
            <FontAwesomeIcon icon={faPlus} />
            Deploy Task
          </button>
        </div>
      ) : (
        <TaskTable
          tasks={tasks}
          setTasks={setTasks}
          modules={modules}
          selectedProject={selectedProject}
          selectedWorkspace={selectedWorkspace}
          workspaceMembers={workspaceMembers}
          onCreateTask={() => setShowTaskModal(true)}
        />
      )}
    </div>
  )
}

export default ProjectDetails
