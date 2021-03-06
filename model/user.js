const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  socialId: String,
  imageUrl: {
    type: String,
    default: "not available"
  },
  emailId: String,
  role: {
    type: String,
    default: "public"
  },
  phoneNumber: String
});

const User = mongoose.model("user", userSchema);

module.exports = User;
