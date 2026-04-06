export const requireRole = (roles = []) => {
    return (req,res,next) => {
        const userRole = req.workspaceMember.role;
        if(!roles.includes(userRole)) {
            return res.status(403).json({
                message: "Insufficient permissions"
            });
        }
        next();
    }
}