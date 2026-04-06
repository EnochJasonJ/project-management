import { supabase } from "../config/db.js";

export const checkProjectAccess = async (req,res,next) => {
    try {
        const userId = req.user.id;
        const projectId = req.params.id || req.body.project_id || req.query.project_id;
        if(!projectId) return res.status(400).json({message: "Project ID missing"});
        const {data: project, error} = await supabase
        .from("projects")
        .select("workspace_id")
        .eq("id",projectId)
        .single();
        if(error || !project) return res.status(404).json({message: "Project not found"});
        const {data: member} = await supabase
        .from("workspace_members")
        .select("*")
        .eq("workspace_id",project.workspace_id)
        .eq("user_id", userId)
        .limit(1);
        if(!member || member.length === 0) return res.status(403).json({message: "No access to this project"});
        req.project = project;
        next();
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

