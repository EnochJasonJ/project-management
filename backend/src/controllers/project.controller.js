import { supabase } from "../config/db.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
    try {
        const { name, description, workspace_id } = req.body;
        const { data, error } = await supabase
            .from("projects")
            .insert([{
                name,
                description,
                workspace_id
            }])
            .select("*")
            .single();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET PROJECTS

export const getProjects = async (req, res) => {
    try {
        const { workspace_id } = req.query;
        if(!workspace_id) return res.status(400).json({message: "workspace_id is required"})
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("workspace_id", workspace_id);
        if (error) {
            console.error(error.message);
            return res.status(500).json({ error: error.message });
        }
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("id", id)
            // .single();
            .limit(1);
        if (error) {
            console.error(error.message);
            return res.status(404).json({ error: "Project not found" });
        }
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
}

// UPDATE PROJECT

export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status, priority } = req.body;
        const { data, error } = await supabase
            .from("projects")
            .update({
                name,
                description,
                status,
                priority
            })
            .eq("id", id)
            .select("*")
            .single();

        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// DELETE PROJECT

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from("projects")
            .delete()
            .eq("id", id);
        if (error) return res.status(500).json({ error: error.message });
        res.json({ message: "Project deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};






