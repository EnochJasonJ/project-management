import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faTasks, faUsers, faClock, faPlus, faCheckCircle, faLayerGroup, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import TaskTable from './TaskTable'
import CreateTaskModal from './CreateTaskModal'

function ProjectDetails({
  selectedProject,
  modules,
  tasks,
  setTasks,
  selectedWorkspace,
  workspaceMembers,
  createTask,
  onCreateModule
}) {
  const [showTaskModal, setShowTaskModal] = useState(false)

  if (!selectedProject) {
    return (
      <div className="ml-[280px] flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FontAwesomeIcon icon={faFolder} className="text-3xl text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No project selected</h2>
          <p className="text-gray-400">Select a project from the sidebar to view details</p>
        </div>
      </div>
    )
  }

  // Calculate stats
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'done').length
  const inProgressTasks = tasks.filter(t => t.status === 'in progress').length

  return (
    <div className="ml-[280px] flex-1 min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-8">
      {/* Task Modal */}
      {showTaskModal && (
        <CreateTaskModal
          modules={modules}
          workspaceMembers={workspaceMembers}
          onCreateTask={(taskData) => {
            createTask(taskData)
            setShowTaskModal(false)
          }}
          onClose={() => setShowTaskModal(false)}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
              <FontAwesomeIcon icon={faFolder} className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {selectedProject.name}
              </h1>
              <p className="text-gray-500 text-sm">{selectedProject.description || 'No description'}</p>
            </div>
          </div>
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            <FontAwesomeIcon icon={faPlus} size="sm" />
            New Task
          </button>
        </div>

        {/* Project Status Badges */}
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            selectedProject.status === 'completed' ? 'bg-green-100 text-green-700' :
            selectedProject.status === 'in progress' ? 'bg-amber-100 text-amber-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {selectedProject.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            selectedProject.priority === 'high' ? 'bg-red-100 text-red-700' :
            selectedProject.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
            'bg-green-100 text-green-700'
          }`}>
            {selectedProject.priority} priority
          </span>
          {selectedProject.due_date && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              <FontAwesomeIcon icon={faClock} size="xs" />
              Due {new Date(selectedProject.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faTasks} className="text-gray-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{totalTasks}</p>
              <p className="text-xs text-gray-500">Total Tasks</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{inProgressTasks}</p>
              <p className="text-xs text-gray-500">In Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{completedTasks}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{modules.length}</p>
              <p className="text-xs text-gray-500">Modules</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Table - Notion-style */}
      {modules.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faLayerGroup} className="text-3xl text-indigo-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Modules Yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Modules help you organize tasks into logical groups. Create your first module to get started.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onCreateModule}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              <FontAwesomeIcon icon={faPlus} size="sm" />
              Create Module
            </button>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-400 mb-3">Workflow</p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Create Module</span>
              </div>
              <FontAwesomeIcon icon={faChevronDown} className="text-gray-300 rotate-[-90deg]" size="xs" />
              <div className="flex items-center gap-2 text-gray-600">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Add Tasks</span>
              </div>
              <FontAwesomeIcon icon={faChevronDown} className="text-gray-300 rotate-[-90deg]" size="xs" />
              <div className="flex items-center gap-2 text-gray-600">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Track Progress</span>
              </div>
            </div>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faTasks} className="text-3xl text-amber-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tasks Yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You have modules set up, but no tasks. Start adding tasks to track your work.
          </p>
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors shadow-md"
          >
            <FontAwesomeIcon icon={faPlus} size="sm" />
            Create Task
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
