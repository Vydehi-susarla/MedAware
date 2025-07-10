const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine");

router.post("/add", async (req, res) => {
  const { name, description, postedBy } = req.body;
  const med = new Medicine({ name, description, postedBy });
  await med.save();
  res.json(med);
});

router.get("/all", async (req, res) => {
  const data = await Medicine.find({ claimed: false });
  res.json(data);
});

router.post("/claim/:id", async (req, res) => {
  const med = await Medicine.findById(req.params.id);
  med.claimed = true;
  await med.save();
  res.json({ message: "Medicine claimed" });
});
// Take a medicine (generate receiver ID)
router.post("/take/:id", async (req, res) => {
  try {
    const receiverId = Math.random().toString(36).substring(2, 10);
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { receiverId, claimed: true },
      { new: true }
    );
    if (!medicine) return res.status(404).send("Medicine not found");
    res.json({ receiverId });
  } catch (err) {
    res.status(500).send("Error taking medicine");
  }
});

// Confirm handover using receiver ID
router.post("/confirm/:id", async (req, res) => {
  const { receiverId } = req.body;
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).send("Medicine not found");
    if (medicine.receiverId !== receiverId)
      return res.status(400).send("Invalid receiver ID");
    medicine.isCollected = true;
    await medicine.save();
    res.send("Medicine marked as collected");
  } catch (err) {
    res.status(500).send("Error confirming medicine handover");
  }
});


module.exports = router;