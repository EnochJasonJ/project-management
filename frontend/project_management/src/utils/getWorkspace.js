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
        const workspaceId = response.data[0]?.id;
        return workspaceId;
    } catch (error) {
        console.error(error);
    }
}

const getWorkspaces = async () => {
    const token = localStorage.getItem("token");
    const URL = `${import.meta.env.VITE_API_URL || 'https://project-management-8lud.onrender.com'}/api/workspaces`;
    try {
        const response = await axios.get(URL,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const getWorkspaceMembers = async (workspaceId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'https://project-management-8lud.onrender.com'}/api/workspaces/${workspaceId}/members`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default {getWorkspacedetails , getWorkspaces, getWorkspaceMembers};