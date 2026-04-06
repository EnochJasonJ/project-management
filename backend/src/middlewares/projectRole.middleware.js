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
            }

            const {data: projectMember} = await supabase
            .from("project_members")
            .select("role")
            .eq("project_id",projectId)
            .eq("user_id", userId)
            .limit(1);

            if(!projectMember || projectMember.length === 0) return res.status(403).json({message: "Not part of project"});

            const userRole = projectMember[0].role;

            if(!roles.includes(userRole)){
                return res.status(403).json({
                    message: "Insufficient project permissions"
                });
            }
            req.projectRole = userRole;
            next();


            // const {data, error} = await supabase.from("project_members")
            // .select("*")
            // .eq("project_id",projectId)
            // .eq("user_id",userId)
            // .limit(1);
            // if(error || !data || data.length === 0) return res.status(403).json({message: "Not part of the project"});
            // // const userRole = data[0].role;
            // if(!roles.includes(userRole)) return res.status(403).json({
            //     message: "Insufficient project permissions"
            // });
            // req.projectMember = data[0];
            // next();
        } catch (error) {
            console.error(error.message);
            res.status(500).json({error: error.message});
        }
    }
}

