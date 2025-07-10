const mongoose = require("mongoose");
const medicineSchema = new mongoose.Schema({
  name: String,
  description: String,
  postedBy: String,
  claimed: { type: Boolean, default: false },
});
module.exports = mongoose.model("Medicine", medicineSchema);