import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ProjectDetails from '../components/ProjectDetails'
import axios from 'axios'
import getWorkspace from '../utils/getWorkspace'

function ProjectsPage() {
  const token = localStorage.getItem("token")
  const URL = "http://localhost:3000/api/projects"
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [workspaces, setWorkspaces] = useState([])
  const [selectedWorkspace, setSelectedWorkspace] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [modules, setModules] = useState([])
  const [tasks, setTasks] = useState([])

  const createProject = async (project) => {
    try {
      const response = await axios.post(URL, project, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      setProjects(prev => [...prev, response.data])
      setSelectedProject(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const createWorkspace = async (workspace) => {
    try {
      const response = await axios.post("http://localhost:3000/api/workspaces/", workspace, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      setWorkspaces(prev => [...prev, response.data])
      setSelectedWorkspace(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const createModule = async (module) => {
    try {
      if (!token) {
        console.error("NO TOKEN!")
        return
      }
      const response = await axios.post("http://localhost:3000/api/modules", module, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      setModules(prev => [...prev, response.data])
      setSelectedModule(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const createTask = async (task) => {
    try {
      const response = await axios.post("http://localhost:3000/api/tasks/create", task, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      setTasks(prev => [...prev, response.data])
    } catch (error) {
      console.error(error)
    }
  }

  const deleteWorkspace = async () => {
    if (!selectedWorkspace) return
    try {
      const workspace_id = selectedWorkspace.id
      await axios.delete(`http://localhost:3000/api/workspaces/${workspace_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setWorkspaces(prev => prev.filter(w => w.id !== workspace_id))
      const remaining = workspaces.filter(w => w.id !== workspace_id)
      setSelectedWorkspace(remaining.length > 0 ? remaining[0] : null)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const data = await getWorkspace.getWorkspaces()
      setWorkspaces(data)
      if (data.length > 0) setSelectedWorkspace(data[0])
    }
    fetchWorkspaces()
  }, [])

  useEffect(() => {
    if (!selectedWorkspace) return
    const fetchProjects = async () => {
      const res = await axios.get(
        `http://localhost:3000/api/projects?workspace_id=${selectedWorkspace.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setProjects(res.data)
      setSelectedProject(res.data.length > 0 ? res.data[0] : null)
    }
    fetchProjects()
  }, [selectedWorkspace])

  return (
    <div className="flex flex-row items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
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
        modules={modules}
        setModules={setModules}
        createModule={createModule}
        createTask={createTask}
        tasks={tasks}
        setTasks={setTasks}
        selectedModule={selectedModule}
        setSelectedModule={setSelectedModule}
      />
      <ProjectDetails
        selectedProject={selectedProject}
        modules={modules}
        tasks={tasks}
        setTasks={setTasks}
        selectedWorkspace={selectedWorkspace}
        createTask={createTask}
        onCreateModule={() => {
          // Trigger module creation from sidebar
          const event = new CustomEvent('open-module-modal')
          window.dispatchEvent(event)
        }}
      />
    </div>
  )
}

export default ProjectsPage
