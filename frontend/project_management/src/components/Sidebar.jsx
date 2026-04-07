import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark, faPlus, faSignOutAlt, faTrash, faChevronDown, faFolder, faLayerGroup, faTasks } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import ListProjects from './ListProjects'
import CreateProjectModal from './CreateProjectModal'
import CreateWorkspaceModal from './CreateWorkspaceModal'
import CreateModuleModal from './CreateModuleModal'
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
  workspaceMembers,
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false)
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showTaskModal,setShowTaskModal] = useState(false);
  const [showToggle, setShowToggle] = useState(true)
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false)
  const navigate = useNavigate()
  const userName = localStorage.getItem("userName")
  const emailId = localStorage.getItem("emailId")

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

  useEffect(() => {
    const handleOpenModuleModal = () => setShowModuleModal(true)
    window.addEventListener('open-module-modal', handleOpenModuleModal)
    return () => window.removeEventListener('open-module-modal', handleOpenModuleModal)
  }, [])

  return (
    <div className="relative">
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
          modules={modules}
          workspaceMembers={workspaceMembers}
          onCreateTask={(taskData) => {
            createTask(taskData)
            setShowTaskModal(false)
          }}
          onClose={() => setShowTaskModal(false)}
        />
      )}

      {collapsed && showToggle && (
        <button
          onClick={collapse}
          className="fixed top-4 left-4 z-50 bg-enterprise-dark text-white shadow-md rounded-md flex items-center justify-center h-10 w-10 hover:bg-enterprise-accent transition-all"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}

      <div
        id="sidebar-container"
        className={`bg-enterprise-dark h-[100vh] fixed top-0 left-0 border-r border-white/10 shadow-xl transform z-40 transition-all duration-300 ${collapsed ? '-translate-x-full' : 'translate-x-0'} w-72`}
      >
        <div className="flex flex-col h-full">
          {/* User Header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <Avatar name={userName} />
              <div className="overflow-hidden">
                <p className="font-bold text-white text-base truncate leading-tight">{userName}</p>
                <p className="text-xs text-enterprise-muted truncate uppercase tracking-widest mt-0.5">{emailId}</p>
              </div>
            </div>
          </div>

          {/* Workspace Switcher */}
          <div className="px-4 py-6">
            <div className="relative">
              <p className="text-xs font-bold text-enterprise-muted uppercase tracking-[0.15em] mb-2 px-1">Workspace Context</p>
              <button
                onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-white transition-all"
              >
                <span className="text-sm font-semibold truncate">
                  {selectedWorkspace?.name || "Select Workspace"}
                </span>
                <FontAwesomeIcon icon={faChevronDown} className="text-white/30 text-xs" />
              </button>

              {showWorkspaceDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#2d3748] rounded-lg shadow-2xl border border-white/10 overflow-hidden z-50">
                  {workspaces.map(ws => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        setSelectedWorkspace(ws)
                        setShowWorkspaceDropdown(false)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-enterprise-accent text-white text-sm font-medium transition-colors border-b border-white/5 last:border-0"
                    >
                      {ws.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-3 space-y-1.5 py-2">
            <div className="px-3 mb-2">
              <p className="text-xs font-bold text-enterprise-muted uppercase tracking-[0.15em]">Deployment</p>
            </div>
            
            <button
              onClick={() => setShowProjectModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-enterprise-muted hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
            >
              <FontAwesomeIcon icon={faPlus} className="text-enterprise-muted w-4" />
              <span>Initiate Project</span>
            </button>

            <button
              onClick={() => setShowWorkspaceModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-enterprise-muted hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
            >
              <FontAwesomeIcon icon={faPlus} className="text-enterprise-muted w-4" />
              <span>Create Workspace</span>
            </button>

            <div className="pt-6 px-3 mb-2">
              <p className="text-xs font-bold text-enterprise-muted uppercase tracking-[0.15em]">Registry</p>
            </div>
            <div className="px-1 max-h-[45vh] overflow-y-auto custom-scrollbar">
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

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/5 space-y-2">
            {selectedWorkspace && (
              <button
                onClick={deleteWorkspace}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all text-sm font-medium"
              >
                <FontAwesomeIcon icon={faTrash} className="w-4" />
                <span>Destroy Workspace</span>
              </button>
            )}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-enterprise-muted hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
              <span>Exit System</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
