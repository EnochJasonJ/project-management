import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ProjectDetails from '../components/ProjectDetails'
import axios from 'axios'
import getWorkspace from '../utils/getWorkspace'

function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [workspaces, setWorkspaces] = useState([])
  const [selectedWorkspace, setSelectedWorkspace] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [modules, setModules] = useState([])
  const [tasks, setTasks] = useState([])
  const [workspaceMembers, setWorkspaceMembers] = useState([])

  const token = localStorage.getItem("token")

  const createProject = async (project) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/projects`, project, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProjects([...projects, response.data])
    } catch (error) { console.error(error) }
  }

  const updateProject = async (projectId, projectData) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/projects/${projectId}`, projectData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProjects(projects.map(p => p.id === projectId ? response.data : p))
      if (selectedProject?.id === projectId) setSelectedProject(response.data)
    } catch (error) { console.error(error) }
  }

  const createWorkspace = async (workspace) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/workspaces`, workspace, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setWorkspaces([...workspaces, response.data])
    } catch (error) { console.error(error) }
  }

  const deleteWorkspace = async () => {
    if (!selectedWorkspace) return
    if (!window.confirm("Are you sure you want to delete this workspace?")) return
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/workspaces/${selectedWorkspace.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setWorkspaces(workspaces.filter(ws => ws.id !== selectedWorkspace.id))
      setSelectedWorkspace(null)
    } catch (error) { console.error(error) }
  }

  const createModule = async (module) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/modules`, module, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setModules([...modules, response.data])
    } catch (error) { console.error(error) }
  }

  const createTask = async (taskData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/tasks/create`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTasks([...tasks, response.data])
    } catch (error) { console.error(error) }
  }

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const res = await getWorkspace.getWorkspaces()
      setWorkspaces(res || [])
      if (res && res.length > 0) setSelectedWorkspace(res[0])
    }
    fetchWorkspaces()
  }, [])

  useEffect(() => {
    if (!selectedWorkspace) {
      setWorkspaceMembers([])
      return
    }
    const fetchWorkspaceMembers = async () => {
      const members = await getWorkspace.getWorkspaceMembers(selectedWorkspace.id)
      setWorkspaceMembers(members)
    }
    fetchWorkspaceMembers()
  }, [selectedWorkspace])

  useEffect(() => {
    if (!selectedWorkspace) return
    const fetchProjects = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/projects?workspace_id=${selectedWorkspace.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setProjects(res.data)
      if (res.data.length > 0) setSelectedProject(res.data[0])
      else setSelectedProject(null)
    }
    fetchProjects()
  }, [selectedWorkspace])

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
