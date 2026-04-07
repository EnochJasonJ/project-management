import axios from "axios";

const getWorkspacedetails = async () => {
    const token = localStorage.getItem("token");
    const URL = `${import.meta.env.VITE_API_URL || 'https://project-management-8lud.onrender.com'}/api/workspaces`;
    try {
        const response = await axios.get(URL,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const workspaceId = response.data[0].id;
        return workspaceId;
    } catch (error) {
        console.error(error);
    }
}

const getProjects = async () => {
    const token = localStorage.getItem("token");
    const workspaceId = await getWorkspacedetails();
    const URL = `${import.meta.env.VITE_API_URL || 'https://project-management-8lud.onrender.com'}/api/projects?workspace_id=${workspaceId}`;
    try {
        const response = await axios.get(URL,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.error(error)
    }
}

export default getProjects