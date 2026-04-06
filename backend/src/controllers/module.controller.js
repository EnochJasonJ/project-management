import { supabase } from "../config/db.js";

// CREATE MODULES

export const createModule = async (req,res) => {
    try {
        const {name, project_id, workspace_id} = req.body;
        const {data, error} = await supabase
        .from("modules")
        .insert([{name, project_id, workspace_id}])
        .select("*")
        .single();
        if(error) return res.status(500).json({error: error.message});
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// GET MODULES

export const getModules = async (req,res) => {
    try {
        const {project_id} = req.params;
        if(!project_id) return res.status(400).json({message: "project_id required"});
        const {data, error} = await supabase
        .from("modules")
        .select("*")
        .eq("project_id", project_id);
        if(error) return res.status(500).json({error: error.message});
        res.json(data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// UPDATE MODULE
export const updateModule = async (req,res) => {
    try {
        const {id} = req.params;
        const {name} = req.body;
        const {data, error} = await supabase
        .from("modules")
        .update({name})
        .eq("id",id)
        .select("*")
        .single();

        if(error) return res.status(500).json({error: error.message});
        res.json(data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// DELETE MODULE
export const deleteModule = async (req, res) => {
    try {
        const {id} = req.params;
        const {error} = await supabase
        .from("modules")
        .delete()
        .eq("id",id);
        if(error) return res.status(500).json({error: error.message});
        res.json({message: "Module deleted"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};



