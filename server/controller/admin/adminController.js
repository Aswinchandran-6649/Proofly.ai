const users = require('../../model/user/UserModel');

// Get Statistics for Dashboard
exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await users.countDocuments({ role: 'user' });
        const totalSellers = await users.countDocuments({ role: 'seller' });
        const pendingApprovals = await users.countDocuments({ role: 'seller', isVerified: false });
        
        res.status(200).json({
            totalUsers,
            totalSellers,
            pending: pendingApprovals
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching stats", error: err });
    }
};

// Get All Users (excluding admins)
exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await users.find({ role: 'user' }).select('-password');
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get All Sellers
exports.getAllSellers = async (req, res) => {
    try {
        const allSellers = await users.find({ role: 'seller' }).select('-password');
        res.status(200).json(allSellers);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Verify/Approve Seller
exports.verifySeller = async (req, res) => {
    const { id } = req.params;
    const { isVerified } = req.body;
    try {
        const updatedSeller = await users.findByIdAndUpdate(
            id, 
            { isVerified }, 
            { new: true }
        );
        res.status(200).json(updatedSeller);
    } catch (err) {
        res.status(500).json(err);
    }
};
//Delete seller
exports.deleteSeller = async (req, res) => {
    const { id } = req.params;
    try {
        await users.findByIdAndDelete(id);
        res.status(200).json("Seller deleted successfully");
    } catch (err) {
        res.status(500).json({ error: "Failed to delete seller" });
    }
};
// Delete User/Seller
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await users.findByIdAndDelete(id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
};

//
exports.getUserGrowth = async (req, res) => {
    try {
        const growthData = await users.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Groups by month number
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } } // Sort Jan to Dec
        ]);
        res.status(200).json(growthData);
    } catch (err) {
        res.status(500).json(err);
    }
};