const adminMiddleware = (req, res, next) => {
    // 1. Check if req.user exists (populated by protect middleware)
    // 2. Check if the user's role is specifically 'admin'
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, proceed to the controller
    } else {
        // User is logged in but NOT an admin
        return res.status(403).json({ 
            message: "Access Denied: You do not have administrative privileges." 
        });
    }
};

module.exports = adminMiddleware;