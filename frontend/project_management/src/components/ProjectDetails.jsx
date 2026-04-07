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
      <div className="ml-72 flex-1 flex items-center justify-center bg-enterprise-light">
        <div className="text-center p-12">
          <div className="w-24 h-24 bg-white shadow-md border border-enterprise-muted/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <FontAwesomeIcon icon={faFolder} className="text-3xl text-enterprise-muted" />
          </div>
          <h2 className="text-xl font-bold text-enterprise-dark tracking-tight uppercase">Operational Dashboard</h2>
          <p className="text-enterprise-muted text-base mt-2 font-medium">Select a project context to view metrics</p>
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
    <div className="ml-72 flex-1 min-h-screen bg-enterprise-light p-10 overflow-y-auto">
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
      <div className="mb-10 bg-white border border-enterprise-muted/20 shadow-sm rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-enterprise-dark rounded-xl flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faFolder} className="text-white text-3xl" />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-enterprise-dark tracking-tighter">
                  {selectedProject.name}
                </h1>
                <span className="bg-enterprise-light text-enterprise-dark text-xs font-bold px-3 py-1 rounded-md border border-enterprise-muted/30 uppercase tracking-widest">
                  {selectedProject.status}
                </span>
              </div>
              <p className="text-enterprise-muted text-base font-medium mt-1 italic">{selectedProject.description || 'System description pending...'}</p>
            </div>
          </div>
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-3 px-6 py-3 bg-enterprise-dark text-white rounded-lg hover:bg-enterprise-accent transition-all shadow-md text-sm font-bold uppercase tracking-[0.1em]"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Operation
          </button>
        </div>

        <div className="flex items-center gap-10 border-t border-enterprise-muted/10 pt-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-enterprise-muted uppercase tracking-[0.2em]">Priority</span>
            {isEditingPriority ? (
              <select
                value={selectedProject.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                onBlur={() => setIsEditingPriority(false)}
                autoFocus
                className="text-sm font-bold uppercase border border-enterprise-muted/30 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-enterprise-dark bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            ) : (
              <button 
                onClick={() => setIsEditingPriority(true)}
                className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all hover:scale-105 border ${
                  selectedProject.priority === 'high' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-enterprise-light text-enterprise-dark border-enterprise-muted/20'
                }`}
              >
                {selectedProject.priority.toUpperCase()}
              </button>
            )}
          </div>
          
          {selectedProject.due_date && (
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faClock} className="text-enterprise-muted text-xs" />
              <span className="text-xs font-bold text-enterprise-muted uppercase tracking-[0.2em]">
                Target: {new Date(selectedProject.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        {[
          { label: 'System Tasks', value: totalTasks, icon: faTasks, color: 'text-enterprise-dark' },
          { label: 'Active Flow', value: inProgressTasks, icon: faClock, color: 'text-blue-600' },
          { label: 'Deployed', value: completedTasks, icon: faCheckCircle, color: 'text-green-600' },
          { label: 'Sub-Modules', value: modules.length, icon: faUsers, color: 'text-enterprise-muted' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-enterprise-muted/20 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-enterprise-light rounded-xl flex items-center justify-center border border-enterprise-muted/10 shadow-inner">
              <FontAwesomeIcon icon={stat.icon} className={`${stat.color} text-lg`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-enterprise-dark leading-none tracking-tight">{stat.value}</p>
              <p className="text-xs font-bold text-enterprise-muted uppercase tracking-widest mt-2">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      {modules.length === 0 ? (
        <div className="bg-white rounded-2xl border border-enterprise-muted/20 p-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-enterprise-light rounded-full flex items-center justify-center mx-auto mb-8 border border-enterprise-muted/10">
            <FontAwesomeIcon icon={faLayerGroup} className="text-3xl text-enterprise-muted" />
          </div>
          <h3 className="text-2xl font-bold text-enterprise-dark uppercase tracking-widest mb-4">Initialize System Architecture</h3>
          <p className="text-enterprise-muted text-base mb-10 max-w-sm mx-auto font-medium leading-relaxed">
            Construct operational modules to begin multi-tenant task distribution and resource tracking.
          </p>
          <button
            onClick={onCreateModule}
            className="inline-flex items-center gap-3 px-8 py-4 bg-enterprise-dark text-white font-bold rounded-lg hover:bg-enterprise-accent transition-all shadow-lg uppercase text-xs tracking-[0.2em]"
          >
            <FontAwesomeIcon icon={faPlus} />
            Instantiate Module
          </button>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-enterprise-muted/20 p-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-enterprise-light rounded-full flex items-center justify-center mx-auto mb-8 border border-enterprise-muted/10">
            <FontAwesomeIcon icon={faTasks} className="text-3xl text-enterprise-muted" />
          </div>
          <h3 className="text-2xl font-bold text-enterprise-dark uppercase tracking-widest mb-4">Queue Task Payload</h3>
          <p className="text-enterprise-muted text-base mb-10 max-w-sm mx-auto font-medium leading-relaxed">
            Module registry verified. No active tasks detected in this project sector.
          </p>
          <button
            onClick={() => setShowTaskModal(true)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-enterprise-dark text-white font-bold rounded-lg hover:bg-enterprise-accent transition-all shadow-lg uppercase text-xs tracking-[0.2em]"
          >
            <FontAwesomeIcon icon={faPlus} />
            Deploy Logic
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
