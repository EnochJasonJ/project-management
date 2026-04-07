import axios from "axios";

const deleteModule = async (module_id) => {
    const token = localStorage.getItem("token");
    const URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/modules/${module_id}`;
    try {
        console.log(`Trying to delete ${module_id}`);
        const response = await axios.delete(URL, {
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

export default deleteModule;