import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import { protect } from "./src/middlewares/auth.middleware.js";
import workspaceRoutes from "./src/routes/workspace.routes.js";
import projectRoutes from "./src/routes/project.routes.js";
import TaskRoutes from "./src/routes/task.routes.js";
import ModuleRoutes from "./src/routes/module.routes.js";
import CommentRoutes from "./src/routes/comment.routes.js";
dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());

// Handle trailing slashes for GET requests
app.use((req, res, next) => {
    if (req.method === 'GET' && req.path.length > 1 && req.path.endsWith('/')) {
        const query = req.url.slice(req.path.length);
        const safepath = req.path.slice(0, -1);
        res.redirect(301, safepath + query);
    } else {
        next();
    }
});

app.use("/api/auth",authRoutes);
app.use("/api/workspaces",workspaceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks",TaskRoutes);
app.use("/api/modules",ModuleRoutes);
app.use("/api/comments", CommentRoutes);

const PORT = process.env.PORT || 3000;

app.get('/',(req,res) => {
    res.send('TaskFlow Enterprise API Running! 🚀');
});

app.get("/api/test",protect,(req,res) => {
    res.json({
        message: "Protected route working",
        user: req.user
    })
})


app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
})