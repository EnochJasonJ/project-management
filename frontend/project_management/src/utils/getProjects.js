import axios from "axios";
import { useState } from "react";

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const getWorkspacedetails = async () => {
    const URL = "http://localhost:3000/api/workspaces";
    try {
        const response = await axios.get(URL,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        // console.log(response.data);
        const workspaceId = response.data[0].id;
        // console.log(workspaceId)
        return workspaceId;
    } catch (error) {
        console.error(error);
    }
}

const getProjects = async () => {
    const workspaceId = await getWorkspacedetails();
    // console.log(workspaceId)
    const URL = `http://localhost:3000/api/projects?workspace_id=${workspaceId}`;
    try {
        const response = await axios.get(URL,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error)
    }
}

export default getProjects