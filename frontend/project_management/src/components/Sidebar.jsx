import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark, faPlus, faSignOutAlt, faTrash, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import Email from './Email'
import ListProjects from './ListProjects'
import CreateProjectModal from './CreateProjectModal'
import CreateWorkspaceModal from './CreateWorkspaceModal'
import CreateModuleModal from './CreateModuleModal'
import fetchTasks from '../utils/getTasks'
import CreateTaskModal from './CreateTaskModal'


function Sidebar({
  createProject,
  createWorkspace,
  createModule,
  createTask,
  deleteWorkspace,
  projects,
  setProjects,
  selectedProject,
  setSelectedProject,
  workspaces,
  selectedWorkspace,
  setSelectedWorkspace,
  selectedModule,
  setSelectedModule,
  modules,
  setModules,
  tasks,
  setTasks,
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false)
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showTaskModal,setShowTaskModal] = useState(false);
  const [showToggle, setShowToggle] = useState(true)
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false)
  const navigate = useNavigate()
  const userName = localStorage.getItem("user")
  const email = localStorage.getItem("email")

  const collapse = () => {
    if (!collapsed) {
      setCollapsed(true)
      setTimeout(() => setShowToggle(true), 450)
    } else {
      setShowToggle(false)
      setCollapsed(false)
    }
  }

  

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  // Listen for module modal open event from ProjectDetails
  useEffect(() => {
    const handleOpenModuleModal = () => setShowModuleModal(true)
    window.addEventListener('open-module-modal', handleOpenModuleModal)
    return () => window.removeEventListener('open-module-modal', handleOpenModuleModal)
  }, [])

  return (
    <div>
      {showProjectModal && (
        <CreateProjectModal
          createProject={createProject}
          selectedWorkspace={selectedWorkspace}
          onClose={() => setShowProjectModal(false)}
        />
      )}
      {showWorkspaceModal && (
        <CreateWorkspaceModal
          createWorkspace={createWorkspace}
          onClose={() => setShowWorkspaceModal(false)}
        />
      )}

      {showModuleModal && (
        <CreateModuleModal
        createModule={createModule}
        selectedProject={selectedProject}
        selectedWorkspace={selectedWorkspace}
        onClose={() => setShowModuleModal(false)}
        />
      )}

      {showTaskModal && (
        <CreateTaskModal
        createTask={createTask}
        selectedWorkspace={selectedWorkspace}
        selectedModule={selectedModule}
        onClose={() => setShowTaskModal(false)}
        />
      )}

      {/* Collapsed toggle button */}
      {collapsed && showToggle && (
        <button
          onClick={collapse}
          className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg rounded-full flex items-center justify-center h-10 w-10 transition-all duration-300 hover:scale-110"
        >
          <FontAwesomeIcon icon={faBars} className="text-gray-600" />
        </button>
      )}

      {/* Sidebar */}
      <div
        id="sidebar-container"
        className={`bg-white/70 backdrop-blur-xl h-[100vh] fixed top-0 left-0 border-r border-white/50 shadow-lg shadow-purple-100 transform z-40 transition-all duration-500 ${collapsed ? '-translate-x-full' : 'translate-x-0'}`}
      >
        <div className="flex flex-col h-full justify-between p-4">
          {/* Top section */}
          <div>
            {/* Header */}
            <div className="flex flex-row items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Avatar name={userName} />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{userName}</p>
                  <p className="text-xs text-gray-500">{email}</p>
                </div>
              </div>
              <button
                onClick={collapse}
                className="hover:bg-gray-100 rounded-full flex items-center justify-center h-8 w-8 transition-colors"
              >
                <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
              </button>
            </div>

            {/* Workspace selector */}
            <div className="relative mb-4">
              <button
                onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:border-purple-200 transition-colors"
              >
                <span className="font-medium text-gray-700 truncate">
                  {selectedWorkspace?.name || "Select Workspace"}
                </span>
                <FontAwesomeIcon icon={faChevronDown} className="text-gray-400 text-sm" />
              </button>

              {showWorkspaceDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                  {workspaces.map(ws => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        setSelectedWorkspace(ws)
                        setShowWorkspaceDropdown(false)
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-purple-50 transition-colors text-sm"
                    >
                      {ws.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => setShowProjectModal(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faPlus} className="text-purple-500" />
                <span className="font-medium text-sm">New Project</span>
              </button>

              <button
                onClick={() => setShowWorkspaceModal(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faPlus} className="text-pink-500" />
                <span className="font-medium text-sm">New Workspace</span>
              </button>

              <button
                onClick={() => setShowModuleModal(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faPlus} className="text-pink-500" />
                <span className="font-medium text-sm">New Module</span>
              </button>

              <button
                onClick={() => setShowTaskModal(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faPlus} className="text-pink-500" />
                <span className="font-medium text-sm">New Task</span>
              </button>

              {selectedWorkspace && (
                <button
                  onClick={deleteWorkspace}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span className="font-medium text-sm">Delete Workspace</span>
                </button>
              )}
            </div>

            {/* Projects list */}
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                Projects
              </h3>
              <ListProjects
                projects={projects}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                selectedWorkspace={selectedWorkspace}
                modules={modules}
                setModules={setModules}
                selectedModule={selectedModule}
                setSelectedModule={setSelectedModule}
                tasks={tasks}
                setTasks={setTasks}
              />
            </div>
          </div>

          {/* Bottom - Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar