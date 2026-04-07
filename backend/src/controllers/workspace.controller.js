import { supabase } from "../config/db.js";

export const createWorkspace = async (req,res) => {
    try {
        const {name} = req.body;
        const userId = req.user.id;

        // const workspace = await pool.query(
        //     `
        //         INSERT INTO workspaces(name,owner_id)
        //         VALUES ($1,$2) RETURNING *
        //     `,
        //     [name, userId]
        // );
        const {data: workspace, error: workspaceError} = await supabase
        .from("workspaces")
        .insert([{name,owner_id: userId}])
        .select("*")
        .single();

        if(workspaceError){
            console.error("createWorkspace insert workspace error: ",workspaceError);
            return res.status(500).json({error: workspaceError.message});
        }

        const workspaceId = workspace.id;
        // await pool.query(
        //     `
        //         INSERT INTO workspace_members(workspace_id, user_id, role) VALUES ($1,$2,'admin')
        //     `,
        //     [workspaceId,userId]
        // );
        const {error: memberError} = await supabase
        .from("workspace_members")
        .insert([{workspace_id: workspaceId, user_id: userId, role: "admin"}]);
        if(memberError){
            console.error("createWorkspace insert member error: ", memberError);
            return res.status(500).json({error: memberError.message});
        }
        res.status(201).json(workspace);
    } catch (error) {
        console.error("createWorkspace exception: ", error)
        res.status(500).json({error: error.message});
    }
}

export const getWorkspaces = async (req,res) => {
    try {
        const userId = req.user.id;
        // const result = await pool.query(
        //     `
        //         SELECT w.* FROM workspaces w JOIN workspace_members wm ON wm.workspace_id = w.id WHERE wm.user_id = $1
        //     `,
        //     [userId]
        // );
        const { data, error} = await supabase
        .from("workspace_members")
        .select("workspaces(*)")
        .eq("user_id",userId);
        if(error){
            console.error("getWorkspace error: ", error);
            return res.status(500).json({error: error.message});
        }
        const workspaces = (data || []).map((row) => row.workspaces);
        res.json(workspaces);
    } catch (error) {
        console.error("getWorkspace exception: ", error)
        res.status(500).json({error: error.message});
    }
};

export const deleteWorkspace = async(req,res) => {
    try {
        const {id} = req.params;
        const {error} = await supabase
        .from("workspaces")
        .delete()
        .eq("id",id);

        if(error) return res.status(500).json({error: error.message});
        res.json({message: "Workspace deleted"});
        
    } catch (error) {
        console.error(error.message);
    }
}

export const getWorkspaceMembers = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from("workspace_members")
            .select(`
                user_id,
                role,
                users (
                    id,
                    name,
                    email
                )
            `)
            .eq("workspace_id", id);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const members = data.map(item => ({
            id: item.users.id,
            name: item.users.name,
            email: item.users.email,
            role: item.role
        }));

        res.json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addMemberToWorkspace = async (req, res) => {
    try {
        const { id: workspace_id } = req.params;
        const { user_id, role } = req.body;

        // Verify requester is owner
        const { data: workspace } = await supabase
            .from("workspaces")
            .select("owner_id")
            .eq("id", workspace_id)
            .single();

        if (workspace.owner_id !== req.user.id) {
            return res.status(403).json({ error: "Only the workspace owner can add members" });
        }

        const { data, error } = await supabase
            .from("workspace_members")
            .insert([{
                workspace_id,
                user_id,
                role: role || 'member'
            }])
            .select("*")
            .single();

        if (error) {
            if (error.code === '23505') return res.status(400).json({ error: "User is already a member" });
            return res.status(500).json({ error: error.message });
        }

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};