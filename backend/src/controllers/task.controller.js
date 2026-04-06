import { supabase } from "../config/db.js";

// CREATE TASK

export const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            module_id,
            workspace_id,
            assigned_to
        } = req.body;
        const {data, error} = await supabase
        .from("tasks")
        .insert([{
            title,
            description,
            module_id,
            workspace_id,
            assigned_to
        }])
        .select("*")
        .single();

        if(error) return res.status(500).json({error: error.message});
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// GET TASKS

export const getTasks = async (req,res) => {
    try {
        const {module_id} = req.params;
        const {data, error} = await supabase
        .from("tasks")
        .select("*")
        .eq("module_id", module_id);
        if(error) return res.status(500).json({error: error.message});
        res.json(data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// UPDATE TASK

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            module_id,
            assigned_to,
            status,
            priority,
            deadline
        } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (module_id !== undefined) updateData.module_id = module_id;
        if (assigned_to !== undefined) updateData.assigned_to = assigned_to;
        if (status !== undefined) updateData.status = status;
        if (priority !== undefined) updateData.priority = priority;
        if (deadline !== undefined) updateData.deadline = deadline;

        const { data, error } = await supabase
            .from("tasks")
            .update(updateData)
            .eq("id", id)
            .select("*")
            .single();

        if (error) return res.status(500).json({ error: error.message });
        if (!data) return res.status(404).json({ error: "Task not found" });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





