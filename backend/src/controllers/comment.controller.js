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
                content,
                read_by: [user_id] // Creator has seen it
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

// MARK COMMENT AS SEEN
export const markCommentAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        // Fetch current read_by explicitly
        const { data: comment, error: fetchError } = await supabase
            .from("comments")
            .select("read_by")
            .eq("id", id)
            .maybeSingle();

        if (fetchError) {
            console.error("Supabase Fetch Error (markCommentAsSeen):", fetchError);
            return res.status(500).json({ error: fetchError.message });
        }
        
        if (!comment) return res.status(404).json({ error: "Comment entity not found in database" });

        const readBy = Array.isArray(comment.read_by) ? comment.read_by : [];
        if (!readBy.includes(user_id)) {
            const { data, error: updateError } = await supabase
                .from("comments")
                .update({ read_by: [...readBy, user_id] })
                .eq("id", id)
                .select("*")
                .single();
            
            if (updateError) {
                console.error("Supabase Update Error (markCommentAsSeen):", updateError);
                return res.status(500).json({ error: updateError.message });
            }
            return res.json(data);
        }

        res.json({ message: "Acknowledged" });
    } catch (error) {
        console.error("Catch Block Error (markCommentAsSeen):", error);
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
