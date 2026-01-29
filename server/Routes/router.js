// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const { extractReceiptData } = require("../services/geminiAi");
// const {
//   register,
//   login,
//   googleLoginController,
//   editProfile,
// } = require("../controller/user/authController");
// const warrantyController = require("../controller/warrantyController");
// const upload = multer({ storage: multer.memoryStorage() });
// const multerConfig = require("../middleware/multerMiddleware");
// const { protect } = require("../middleware/authMiddleware");
// const notificationController = require("../controller/user/notificationContoller");
// const aiController = require("../controller/user/aiController");
// // authentication
// router.post("/register", register);
// router.post("/login", login);
// router.post("/google-login", googleLoginController);
// router.put("/user/edit",protect,multerConfig.single("profilePic"),editProfile);

// // --- NOTIFICATIONS ROUTES ---////

// // Get notifications
// router.get('/notifications/:userId', notificationController.getUserNotifications);

// // Mark as read (Removes red dot)
// router.put('/notifications/read/:userId', notificationController.markAsRead);

// // Clear all (Delete button)
// router.delete('/notifications/clear/:userId', notificationController.clearNotifications);

// ////////////////////////////////////////////////////////////////////////////////////////////
// // AI set up THE SCANNING ROUTE

// router.post("/scan-receipt", upload.single("receipt"), aiController.scanReceiptController);
// //------------------warranty routs ------------------------------

// // save warranty
// router.post("/save-warranty", multerConfig.single("receiptImage"),warrantyController.saveWarranty);

// //get all warranties

// router.get("/warranties/:userId", warrantyController.getUserWarranties);

// //delete warranty

// router.delete("/warranty/delete/:id", warrantyController.deleteWarranty);

// // Update warranty (For Archiving)
// router.put("/warranty/update/:id", warrantyController.updateWarranty);

// // Extend warranty (For the Payment/Extension feature)
// router.put("/warranty/extend/:id", warrantyController.extendWarranty);

// // Get a single warranty (THIS IS WHAT THE VIEW PAGE NEEDS)
// router.get("/warranty/:id", warrantyController.getSingleWarranty);

// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  register,
  login,
  googleLoginController,
  editProfile,
} = require("../controller/user/authController");
const warrantyController = require("../controller/user/warrantyController");
const upload = multer({ storage: multer.memoryStorage() });
const multerConfig = require("../middleware/multerMiddleware");
const { protect , authorize} = require("../middleware/authMiddleware"); // Using your existing protect middleware
const adminMiddleware = require('../middleware/adminMiddleware')
const notificationController = require("../controller/user/notificationContoller");
const aiController = require("../controller/user/aiController");
const adminController = require('../controller/admin/adminController')
const sellerController = require('../controller/seller/sellerController')

// --- PUBLIC AUTHENTICATION ---
router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLoginController);

// --- PROTECTED USER ROUTES (Requires Login) ---
router.put("/user/edit", protect, multerConfig.single("profilePic"), editProfile);

// --- NOTIFICATIONS (Protected) ---
router.get('/notifications/:userId', protect, notificationController.getUserNotifications);
router.put('/notifications/read/:userId', protect, notificationController.markAsRead);
router.delete('/notifications/clear/:userId', protect, notificationController.clearNotifications);

// --- AI SCANNING (Protected - Fixed this for you!) ---
router.post("/scan-receipt", protect, upload.single("receipt"), aiController.scanReceiptController);

// --- WARRANTY ROUTES (All Protected) ---
router.post("/save-warranty", protect, multerConfig.single("receiptImage"), warrantyController.saveWarranty);
router.get("/warranties/:userId", protect, warrantyController.getUserWarranties);
router.delete("/warranty/delete/:id", protect, warrantyController.deleteWarranty);
router.put("/warranty/update/:id", protect, warrantyController.updateWarranty);
router.put("/warranty/extend/:id", protect, warrantyController.extendWarranty);
router.get("/warranty/:id", protect, warrantyController.getSingleWarranty);

// --- ADMIN ROUTES  ---
// Stats for the Dashboard Cards
// Change these lines in your router.js
// Use "/admin/stats" instead of just "/stats"

router.get("/admin/stats", protect, adminMiddleware, adminController.getAdminStats);

// Add this one back for your User Management table
router.get("/admin/users", protect, adminMiddleware, adminController.getAllUsers);

router.delete("/admin/user/delete/:id", protect, adminMiddleware, adminController.deleteUser);


router.get("/admin/user-growth", protect, adminMiddleware, adminController.getUserGrowth);

// admin seller-side//

// Get all sellers (for the table)
router.get("/admin/all-sellers", protect, adminMiddleware, adminController.getAllSellers);

//  seller verification status (Approve/Reject)

router.put("/admin/update-seller/:id", protect, adminMiddleware, adminController.verifySeller);

// Delete a seller account
router.delete("/admin/delete-seller/:id", protect, adminMiddleware, adminController.deleteSeller);

// --- SELLER MODULE ROUTES ---

router.get('/seller/dashboard-stats', protect, authorize('seller'), sellerController.getStoreWarranties);

router.get("/seller/claims", protect, sellerController.getSellerWarranties);

//  Route for seller to approve/reject
router.patch("/seller/warranty-status/:id", protect, sellerController.updateWarrantyStatus);

// get all warranties
router.get('/all-warranties', protect, warrantyController.getAllWarranties);

// Route to update warranty status and rejection reason
router.put('/warranty/status/:id', protect, warrantyController.updateWarrantyStatus);

router.get("/seller/verify-warranty/:warrantyId", protect, authorize('seller'), sellerController.verifyWarrantyQRCode);
module.exports = router;