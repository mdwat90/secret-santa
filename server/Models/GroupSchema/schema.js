const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new Schema(
  {
    admin: String,
    name: String,
    password: String,
    memberCount: Number,
    members: [{
      uid: String,
      name: String,
      selected: false,
      selectedBy: String,
      uidSelected: String
    }]
  }
);

module.exports = mongoose.model("Group", GroupSchema);