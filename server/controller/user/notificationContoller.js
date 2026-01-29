const Notification =require('../../model/user/notificationModel')

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId })
                                               .sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

// Mark notifications as read
exports.markAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.params.userId, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ message: "Marked as read" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update status" });
    }
};

// Delete all notifications for a user
exports.clearNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ userId: req.params.userId });
        res.status(200).json({ message: "Notifications cleared" });
    } catch (err) {
        res.status(500).json({ error: "Failed to clear notifications" });
    }
};