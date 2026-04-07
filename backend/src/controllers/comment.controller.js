import { supabase } from "../config/db.js";

// CREATE COMMENT
export const createComment = async (req, res) => {
    try {
        const { task_id, content } = req.body;
        const user_id = req.user.id;

        const { data, error } = await supabase
            .from("comments")
            .insert([{
                task_id,
                user_id,
                content
            }])
            .select(`
                *,
                users (
                    id,
                    name
                )
            `)
            .single();

        if (error) return res.status(500).json({ error: error.message });
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET COMMENTS FOR TASK
export const getCommentsByTask = async (req, res) => {
    try {
        const { task_id } = req.params;
        const { data, error } = await supabase
            .from("comments")
            .select(`
                *,
                users (
                    id,
                    name
                )
            `)
            .eq("task_id", task_id)
            .order("created_at", { ascending: true });

        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE COMMENT
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const { error } = await supabase
            .from("comments")
            .delete()
            .eq("id", id)
            .eq("user_id", user_id);

        if (error) return res.status(500).json({ error: error.message });
        res.json({ message: "Comment deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
