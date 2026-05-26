const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const { protect } = require('../middleware/auth');

// Helper to generate a unique claim code
const generateSecretCode = () => {
  return 'MA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @route   POST /api/medicines
// @desc    Donate a medicine
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { name, expiryDate, quantity, description, image } = req.body;

    if (!name || !expiryDate || !quantity) {
      return res.status(400).json({ message: 'Please add all required fields (name, expiryDate, quantity)' });
    }

    const medicine = await Medicine.create({
      name,
      expiryDate,
      quantity,
      description,
      image,
      donor: req.user._id
    });

    res.status(201).json(medicine);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/medicines
// @desc    Get all available medicines (excluding user's own donations)
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    // Get all available medicines that are NOT donated by the current user
    const medicines = await Medicine.find({
      status: 'Available',
      donor: { $ne: req.user._id }
    }).populate('donor', 'name email');

    res.json(medicines);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/medicines/my-donations
// @desc    Get current user's donations
// @access  Private
router.get('/my-donations', protect, async (req, res, next) => {
  try {
    const donations = await Medicine.find({ donor: req.user._id })
      .populate('claimant', 'name email')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/medicines/my-claims
// @desc    Get current user's claims
// @access  Private
router.get('/my-claims', protect, async (req, res, next) => {
  try {
    const claims = await Medicine.find({ claimant: req.user._id })
      .populate('donor', 'name email')
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/medicines/:id/claim
// @desc    Claim a medicine
// @access  Private
router.post('/:id/claim', protect, async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    if (medicine.status !== 'Available') {
      return res.status(400).json({ message: 'Medicine is not available for claim' });
    }

    if (medicine.donor.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot claim your own donated medicine' });
    }

    const secretCode = generateSecretCode();

    medicine.status = 'Claimed';
    medicine.claimant = req.user._id;
    medicine.secretCode = secretCode;

    await medicine.save();

    res.json({
      message: 'Medicine claimed successfully',
      medicine,
      secretCode // Return code to the claimant so they can share it
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/medicines/:id/verify
// @desc    Verify claim code and complete handover
// @access  Private (Only donor)
router.post('/:id/verify', protect, async (req, res, next) => {
  try {
    const { secretCode } = req.body;

    if (!secretCode) {
      return res.status(400).json({ message: 'Please provide the verification code' });
    }

    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Only donor can verify
    if (medicine.donor.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized, you are not the donor of this medicine' });
    }

    if (medicine.status !== 'Claimed') {
      return res.status(400).json({ message: 'Medicine is not in Claimed status' });
    }

    // Match code (case insensitive trim comparison)
    if (
      medicine.secretCode && 
      medicine.secretCode.trim().toUpperCase() === secretCode.trim().toUpperCase()
    ) {
      medicine.status = 'Completed';
      await medicine.save();
      
      res.json({
        message: 'Handover verified successfully, medicine status is now Completed',
        medicine
      });
    } else {
      res.status(400).json({ message: 'Invalid verification code' });
    }
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/medicines/:id/cancel-claim
// @desc    Cancel a claim and make it available again
// @access  Private (Donor or Claimant)
router.post('/:id/cancel-claim', protect, async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    if (medicine.status !== 'Claimed') {
      return res.status(400).json({ message: 'Medicine is not currently claimed' });
    }

    // Only donor or claimant can cancel
    const isDonor = medicine.donor.toString() === req.user._id.toString();
    const isClaimant = medicine.claimant && medicine.claimant.toString() === req.user._id.toString();

    if (!isDonor && !isClaimant) {
      return res.status(401).json({ message: 'Not authorized to cancel this claim' });
    }

    medicine.status = 'Available';
    medicine.claimant = null;
    medicine.secretCode = null;

    await medicine.save();

    res.json({
      message: 'Claim cancelled successfully, medicine is now available',
      medicine
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
