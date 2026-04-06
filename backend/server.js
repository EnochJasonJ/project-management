import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import { protect } from "./src/middlewares/auth.middleware.js";
import workspaceRoutes from "./src/routes/workspace.routes.js";
import projectRoutes from "./src/routes/project.routes.js";
import TaskRoutes from "./src/routes/task.routes.js";
import ModuleRoutes from "./src/routes/module.routes.js";
dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/workspaces",workspaceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks",TaskRoutes);
app.use("/api/modules",ModuleRoutes);

const PORT = 3000;

app.get('/',(req,res) => {
    res.send('Api Running! 🚀');
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