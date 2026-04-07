import { supabase } from "../config/db.js";

export const requireProjectRole = (roles = []) => {
    return async (req,res,next) => {
        try {
            const userId = req.user.id;
            const projectId = req.params.id;

            const {data: project, error: projectError} = await supabase
            .from("projects")
            .select("workspace_id")
            .eq("id",projectId)
            .single();

            if(projectError || !project) return res.status(404).json({message: "Project not found"});

            const {data: workspaceMember } = await supabase
            .from("workspace_members")
            .select("role")
            .eq("workspace_id", project.workspace_id)
            .eq("user_id",userId)
            .limit(1);

            if(workspaceMember && workspaceMember.length > 0){
                const role = workspaceMember[0].role;
                if(role === "admin"){
                    req.workspaceRole = role;
                    return next();
                }
                
                if (roles.includes(role)) {
                    req.workspaceRole = role;
                    return next();
                }

                return res.status(403).json({
                    message: "Insufficient workspace permissions for this project"
                });
            }

            return res.status(403).json({message: "Not part of the workspace"});
        } catch (error) {
            console.error(error.message);
            res.status(500).json({error: error.message});
        }
    }
}

