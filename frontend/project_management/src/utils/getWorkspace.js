import axios from "axios";

const token = localStorage.getItem("token");
const URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/workspaces` : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/workspaces`;

const getWorkspacedetails = async () => {
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
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/workspaces/${workspaceId}/members`, {
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