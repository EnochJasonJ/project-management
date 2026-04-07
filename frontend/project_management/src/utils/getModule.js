import axios from "axios";

const fetchModules = async(project_id, workspace_id) => {
    if(!project_id || !workspace_id) return;
    const token = localStorage.getItem("token");
    const URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/modules/${project_id}?workspace_id=${workspace_id}`
    try {
        const response = await axios.get(URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
} 



export default fetchModules;