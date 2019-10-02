const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: String,
    password: String,
    selected: false,
    selectedBy: String,
    uidSelected: String
  }
);

module.exports = mongoose.model("User", UserSchema);