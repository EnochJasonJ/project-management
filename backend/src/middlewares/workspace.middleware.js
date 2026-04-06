import { supabase } from "../config/db.js";

export const checkWorkspaceAccess = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // const workspaceId = req.params.workspace_id || req.params.workspaceId || req.params.id || req.body.workspace_id || req.query.workspace_id;
        const workspaceId = req.params.workspace_id || req.params.workspaceId || req.params.id || req.query.workspace_id || req.body.workspace_id;
        // console.log("Workspace ID from req:", workspaceId);
        // console.log("User ID:", userId);
        if (!workspaceId) return res.status(400).json({ message: "Workspace ID missing" });
        const { data, error } = await supabase
            .from("workspace_members")
            .select("*")
            .eq("workspace_id", workspaceId)
            .eq("user_id", userId)
            // .single();
            .limit(1);
        if (error || !data) {
            return res.status(403).json({
                message: "Access denied to workspace"
            });
        }
        req.workspaceMember = data;
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

