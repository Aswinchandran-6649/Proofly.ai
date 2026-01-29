const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema({
  // From AI Scan
  storeName: { 
    type: String, 
    required: true 
  },
  purchaseDate: { 
    type: Date, 
    required: true 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  productName: { 
    type: [String], 
    default: []
  },
  serialNumber: {
    type: String,
    trim: true,
    default: "Not Provided"
},
  
  // App Logic Fields
  warrantyExpiryDate: { 
    type: Date 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiptImage: { 
    type: String, 
    required:true
  },
  
  // --- NEW FIELDS FOR PAYMENT & EXTENSIONS ---
  isExtended: {
    type: Boolean,
    default: false
  },
  paymentHistory: [
    {
      transactionId: { type: String },
      amount: { type: Number },
      monthsAdded: { type: Number },
      paidAt: { type: Date, default: Date.now }
    }
  ],
  // -------------------------------------------

  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
});

// Logic to automatically calculate a default 1-year warranty before saving
// NEW WAY (Async doesn't need 'next')
warrantySchema.pre('save', async function() {
  if (this.purchaseDate && !this.warrantyExpiryDate) {
    const expiry = new Date(this.purchaseDate);
    expiry.setFullYear(expiry.getFullYear() + 1);
    this.warrantyExpiryDate = expiry;
  }
  // No next() call needed here
});

module.exports = mongoose.model('Warranty', warrantySchema);