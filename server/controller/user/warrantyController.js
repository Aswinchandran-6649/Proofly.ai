
const Warranty = require('../../model/user/warrantyModel');
const nodemailer = require("nodemailer");
const User = require('../../model/user/UserModel');


exports.saveWarranty = async (req, res, next) => { 
  try {
    const { 
      storeName, 
      purchaseDate, 
      totalAmount, 
      productName, 
      userId, 
      warrantyExpiryDate,
      serialNumber 
    } = req.body;
    
    const receiptImage = req.file ? req.file.filename : null;
    if (!receiptImage) {
      return res.status(400).json({ error: "Receipt image is required" });
    }

    const matchedSeller = await User.findOne({ 
      username: { $regex: new RegExp(`^${storeName}$`, "i") }, 
      role: 'seller' 
    });

    let finalProductNames = [];
    if (productName) {
      finalProductNames = Array.isArray(productName) ? productName : [productName];
    }

    const newWarranty = new Warranty({
      storeName,
      purchaseDate: new Date(purchaseDate),
      totalAmount: Number(totalAmount),
      productName: finalProductNames,
      userId,
      warrantyExpiryDate: warrantyExpiryDate ? new Date(warrantyExpiryDate) : undefined,
      receiptImage,
      serialNumber,
      // 3. ATTACH THE SELLER ID
      sellerId: matchedSeller ? matchedSeller._id : null,
      status: "Pending" 
    });

    await newWarranty.save();
    res.status(201).json(newWarranty);
  } catch (error) {
    console.error("Mongoose Save Error Detailed:", error);
    res.status(400).json({ 
      error: "Validation Failed", 
      details: error.message 
    });
  }
};
// 2. Get User Warranties
exports.getUserWarranties = async (req, res) => {
  try {
    const warranties = await Warranty.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(warranties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch warranties" });
  }
};

// 3. DELETE WARRANTY
exports.deleteWarranty = async (req, res) => {
  const { id } = req.params; 
  try {
    const deletedWarranty = await Warranty.findByIdAndDelete({ _id: id });
    if (!deletedWarranty) {
      return res.status(404).json({ message: "Warranty not found" });
    }
    res.status(200).json({ message: "Warranty deleted successfully", deletedWarranty });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error during deletion" });
  }
};

// 4. UPDATE WARRANTY (For Archiving/Restoring)
exports.updateWarranty = async (req, res) => {
  const { id } = req.params;
  const { isArchived } = req.body; 
  
  try {
    const updatedWarranty = await Warranty.findByIdAndUpdate(
      { _id: id },
      { isArchived },
      { new: true } 
    );
    
    if (!updatedWarranty) {
      return res.status(404).json({ message: "Warranty not found" });
    }
    res.status(200).json(updatedWarranty);
  } catch (error) {
    res.status(500).json({ error: "Failed to update warranty status" });
  }
};

// 5. GET SINGLE WARRANTY 
exports.getSingleWarranty = async (req, res) => {
  const { id } = req.params;
  try {
    const warranty = await Warranty.findById(id);
    if (!warranty) return res.status(404).json({ message: "Not found" });
    res.status(200).json(warranty);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch warranty detail" });
  }
};

// 6. EXTEND WARRANTY (New Feature Logic)
exports.extendWarranty = async (req, res) => {
  const { id } = req.params;
  const { extensionMonths, paymentId, amountPaid } = req.body;

  try {
    const warranty = await Warranty.findById(id);
    if (!warranty) return res.status(404).json({ message: "Warranty not found" });

    // 1. Calculate new expiry date
    // If already expired, start from today. Otherwise, start from current expiry.
    const currentExpiry = new Date(warranty.warrantyExpiryDate);
    const startDate = currentExpiry > new Date() ? currentExpiry : new Date();
    
    startDate.setMonth(startDate.getMonth() + parseInt(extensionMonths));

    // 2. Update record
    warranty.warrantyExpiryDate = startDate;
    warranty.isExtended = true;
    
    // 3. Add to payment history
    warranty.paymentHistory.push({
      transactionId: paymentId,
      amount: amountPaid,
      monthsAdded: extensionMonths,
      paidAt: new Date()
    });

    await warranty.save();
    res.status(200).json(warranty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get all warranties

exports.getAllWarranties = async (req, res) => {
    // Get storeName from query parameters
    const { storeName } = req.query;
    
    try {
        let query = {};
        if (storeName) {
            // If storeName is provided, filter the results
            query = { storeName: storeName };
        }

        const allWarranties = await Warranty.find(query).sort({ createdAt: -1 });
        res.status(200).json(allWarranties);
    } catch (err) {
        res.status(401).json(`Request Failed: ${err}`);
    }
};

///update warranty statsu

exports.updateWarrantyStatus = async (req, res) => {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    try {
        const updatedWarranty = await Warranty.findByIdAndUpdate(
            id, 
            { 
                status: status, 
                rejectionReason: rejectionReason || "" 
            }, 
            { new: true }
        );
        res.status(200).json(updatedWarranty);
    } catch (err) {
        res.status(401).json(`Update Failed: ${err}`);
    }
};