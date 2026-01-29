const Warranty = require('../../model/user/warrantyModel');
const Notification = require('../../model/user/notificationModel'); 
const nodemailer = require("nodemailer");

// 1. Setup the Email Transporter (Use your existing env variables)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.user,
        pass: process.env.pass,
    },
});
// Fetch warranties assigned to the logged-in seller
exports.getSellerWarranties = async (req, res) => {
  try {
    const claims = await Warranty.find({ sellerId: req.user._id })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch claims" });
  }
};

// Change status to Approved or Rejected
exports.updateWarrantyStatus = async (req, res) => {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    try {
        console.log("--- Starting Status Update ---");
        
        // 1. Update and POPULATE (This is key)
        const updatedWarranty = await Warranty.findByIdAndUpdate(
            id,
            { status, rejectionReason },
            { new: true }
        ).populate("userId"); // This MUST match the field name in your Warranty Model

        if (!updatedWarranty) {
            console.log("❌ Error: Warranty not found");
            return res.status(404).json("Warranty not found");
        }

        console.log("✅ Warranty Updated. Target User:", updatedWarranty.userId?._id);

        // 2. CREATE IN-APP NOTIFICATION
        if (updatedWarranty.userId) {
            try {
                const newNotif = await Notification.create({
                    userId: updatedWarranty.userId._id,
                    message: status === "Approved" 
                        ? `✅ Your warranty for ${updatedWarranty.productName} has been approved!` 
                        : `❌ Your warranty for ${updatedWarranty.productName} was rejected. Reason: ${rejectionReason}`,
                });
                console.log("✅ DB Success: Notification saved!", newNotif._id);
            } catch (notifErr) {
                console.error("❌ DB Error: Failed to save notification:", notifErr.message);
            }
        } else {
            console.log("⚠️ Warning: No user linked to this warranty. Skipping notification.");
        }

        // 3. SEND SUCCESS RESPONSE
        res.status(200).json(updatedWarranty);

    } catch (err) {
        console.error("❌ CRITICAL ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};// Inside your update status controller


// exports.updateWarrantyStatus = async (req, res) => {
//     const { id } = req.params;
//     const { status, rejectionReason } = req.body;

//     try {
//         // 1. Update the Warranty Status
//         const updatedWarranty = await Warranty.findByIdAndUpdate(
//             id, 
//             { status, rejectionReason }, 
//             { new: true }
//         );

//         if (!updatedWarranty) {
//             return res.status(404).json("Warranty not found");
//         }

//         // 2. Create a Notification for the User
//         const newNotification = new Notification({
//             userId: updatedWarranty.userId,
//             title: status === "Approved" ? "Warranty Approved! ✅" : "Warranty Rejected ❌",
//             message: status === "Approved" 
//                 ? `Your warranty for ${updatedWarranty.productName} has been verified.` 
//                 : `Your warranty for ${updatedWarranty.productName} was rejected. Reason: ${rejectionReason}`,
//             status: "unread",
//             createdAt: new Date()
//         });

//         await newNotification.save();

//         res.status(200).json(updatedWarranty);
//     } catch (error) {
//         console.error("Error updating status:", error);
//         res.status(500).json("Internal Server Error");
//     }
// };
exports.getStoreWarranties = async (req, res) => {
    console.log('inside store warranties');
    
    // Get storeName from query parameters (?storeName=ShopName)
    const { storeName } = req.query;

    try {
        if (!storeName) {
            return res.status(400).json("Store name is required to fetch dashboard data.");
        }

        // Find all warranties that were registered under this specific shop/store
        const allWarranties = await Warranty.find({ storeName });

        // Send the data back to the frontend
        res.status(200).json(allWarranties);
        
    } catch (err) {
        console.error("Seller Controller Error:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};
exports.verifyWarrantyQRCode = async (req, res) => {
    try {
        const { warrantyId } = req.params;
        const sellerId = req.user._id; // From the protect middleware

        // Find warranty and populate user details
        const warranty = await Warranty.findById(warrantyId).populate("userId");

        if (!warranty) {
            return res.status(404).json({ message: "Invalid Warranty QR Code" });
        }

        // SECURITY CHECK: Does this warranty belong to this seller's store?
        // Assuming your warranty model has a storeId or sellerId field
        if (warranty.sellerId.toString() !== sellerId.toString()) {
            return res.status(403).json({ message: "Unauthorized: This warranty is not from your store." });
        }

        // Return the data for the seller to see on their scanner screen
        res.status(200).json({
            status: "Verified",
            product: warranty.productName,
            customer: warranty.userId.username,
            expiry: warranty.expiryDate,
            isValid: new Date(warranty.expiryDate) > new Date()
        });

    } catch (err) {
        res.status(500).json("Verification Error");
    }
};