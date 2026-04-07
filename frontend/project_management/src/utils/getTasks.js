import axios from "axios";

const fetchTasks = async(module_id) => {
    const token = localStorage.getItem("token");
    const URL = `${import.meta.env.VITE_API_URL || 'https://project-management-8lud.onrender.com'}/api/tasks/list/${module_id}`;
    try {
        const response = await axios.get(URL,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default fetchTasks;