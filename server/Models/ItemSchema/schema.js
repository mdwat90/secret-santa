const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const id = new mongoose.Types.ObjectId();

const ItemSchema = new Schema(
  {
    user_id: String,
    description: String,
    link: String,
    notes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);