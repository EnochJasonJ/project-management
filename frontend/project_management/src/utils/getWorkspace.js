import axios from "axios";

const token = localStorage.getItem("token");
const URL = "http://localhost:3000/api/workspaces";
const getWorkspacedetails = async () => {
    try {
        const response = await axios.get(URL,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        // console.log(response.data);
        const workspaceId = response.data[0].id;
        console.log(workspaceId)
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
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export default {getWorkspacedetails , getWorkspaces};