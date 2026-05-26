const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please enter medicine name'],
    trim: true
  },
  expiryDate: { 
    type: Date, 
    required: [true, 'Please enter expiry date'] 
  },
  quantity: { 
    type: Number, 
    required: [true, 'Please enter quantity'],
    min: [1, 'Quantity must be at least 1']
  },
  description: { 
    type: String,
    trim: true
  },
  image: { 
    type: String // Base64 Data URL
  },
  donor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Available', 'Claimed', 'Completed'], 
    default: 'Available' 
  },
  claimant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },
  secretCode: { 
    type: String, 
    default: null 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Medicine', MedicineSchema);
