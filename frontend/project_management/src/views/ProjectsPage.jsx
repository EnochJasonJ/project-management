import React, { useEffect, useState, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import ProjectDetails from '../components/ProjectDetails'
import axios from 'axios'
import getWorkspace from '../utils/getWorkspace'
import { toast } from 'react-hot-toast'
import { supabase } from '../utils/supabaseClient'

function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [workspaces, setWorkspaces] = useState([])
  const [selectedWorkspace, setSelectedWorkspace] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [modules, setModules] = useState([])
  const [tasks, setTasks] = useState([])
  const [workspaceMembers, setWorkspaceMembers] = useState([])
  const [isSyncing, setIsSyncing] = useState(false)

  const token = localStorage.getItem("token")

  const fetchWorkspaceMembers = useCallback(async () => {
    if (!selectedWorkspace) {
      setWorkspaceMembers([])
      return
    }
    const members = await getWorkspace.getWorkspaceMembers(selectedWorkspace.id)
    setWorkspaceMembers(members)
  }, [selectedWorkspace])

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session && !localStorage.getItem("token")) {
        setIsSyncing(true)
        try {
          const user = session.user
          const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/oauth-sync`, {
            email: user.email,
            name: user.user_metadata.full_name || user.email.split('@')[0]
          })
          
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("userName", response.data.userName)
          localStorage.setItem("emailId", response.data.emailId)
          localStorage.setItem("userId", response.data.userId)
          
          toast.success('Social authentication verified')
          window.location.reload()
        } catch (error) {
          console.error(error)
          toast.error('Failed to synchronize social account')
        } finally {
          setIsSyncing(false)
        }
      }
    }
    handleOAuthRedirect()
  }, [])

  const createProject = async (project) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/projects`, project, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProjects([...projects, response.data])
      toast.success('Project initiated successfully')
    } catch (error) { 
      console.error(error)
      toast.error('Failed to initiate project')
    }
  }

  const updateProject = async (projectId, projectData) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/projects/${projectId}`, projectData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProjects(projects.map(p => p.id === projectId ? response.data : p))
      if (selectedProject?.id === projectId) setSelectedProject(response.data)
      toast.success('Project configuration updated')
    } catch (error) { 
      console.error(error)
      toast.error('Failed to update project')
    }
  }

  const createWorkspace = async (workspace) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/workspaces`, workspace, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setWorkspaces([...workspaces, response.data])
      toast.success('Workspace environment provisioned')
    } catch (error) { 
      console.error(error)
      toast.error('Failed to provision workspace')
    }
  }

  const deleteWorkspace = async () => {
    if (!selectedWorkspace) return
    if (!window.confirm("Are you sure you want to delete this workspace?")) return
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/workspaces/${selectedWorkspace.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Workspace purged from registry')
      setWorkspaces(workspaces.filter(ws => ws.id !== selectedWorkspace.id))
      setSelectedWorkspace(null)
    } catch (error) { 
      console.error(error)
      toast.error('Failed to purge workspace')
    }
  }

  const createModule = async (module) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/modules`, module, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setModules([...modules, response.data])
      toast.success('Module integrated into architecture')
    } catch (error) { 
      console.error(error)
      toast.error('Failed to integrate module')
    }
  }

  const createTask = async (taskData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/tasks/create`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTasks([...tasks, response.data])
      toast.success('Operational task deployed')
    } catch (error) { 
      console.error(error)
      toast.error('Task deployment failed')
    }
  }

  useEffect(() => {
    if (isSyncing) return
    const fetchWorkspaces = async () => {
      const res = await getWorkspace.getWorkspaces()
      setWorkspaces(res || [])
      if (res && res.length > 0 && !selectedWorkspace) setSelectedWorkspace(res[0])
    }
    if (token) fetchWorkspaces()
  }, [token, isSyncing])

  useEffect(() => {
    fetchWorkspaceMembers()
  }, [fetchWorkspaceMembers])

  // Listen for member updates
  useEffect(() => {
    const handleUpdateMembers = () => fetchWorkspaceMembers()
    window.addEventListener('workspace-members-updated', handleUpdateMembers)
    return () => window.removeEventListener('workspace-members-updated', handleUpdateMembers)
  }, [fetchWorkspaceMembers])

  useEffect(() => {
    if (!selectedWorkspace || !token || isSyncing) return
    const fetchProjects = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/projects?workspace_id=${selectedWorkspace.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setProjects(res.data)
      if (res.data.length > 0 && !selectedProject) setSelectedProject(res.data[0])
    }
    fetchProjects()
  }, [selectedWorkspace, token, isSyncing])

  if (isSyncing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-enterprise-light">
        <div className="w-12 h-12 border-4 border-enterprise-dark border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-enterprise-dark uppercase tracking-widest">Synchronizing Enterprise Identity...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-row min-h-screen bg-enterprise-light font-sans text-enterprise-dark">
      <Sidebar
        createProject={createProject}
        createWorkspace={createWorkspace}
        projects={projects}
        deleteWorkspace={deleteWorkspace}
        setProjects={setProjects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        workspaces={workspaces}
        selectedWorkspace={selectedWorkspace}
        setSelectedWorkspace={setSelectedWorkspace}
        selectedModule={selectedModule}
        setSelectedModule={setSelectedModule}
        modules={modules}
        setModules={setModules}
        tasks={tasks}
        setTasks={setTasks}
        createModule={createModule}
        createTask={createTask}
        workspaceMembers={workspaceMembers}
      />
      <ProjectDetails
        selectedProject={selectedProject}
        onUpdateProject={updateProject}
        modules={modules}
        tasks={tasks}
        setTasks={setTasks}
        selectedWorkspace={selectedWorkspace}
        workspaceMembers={workspaceMembers}
        createTask={createTask}
        onCreateModule={() => {
          const event = new CustomEvent('open-module-modal')
          window.dispatchEvent(event)
        }}
      />
    </div>
  )
}

export default ProjectsPage
