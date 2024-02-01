let mongoose = require("mongoose");
let plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/PinterestClone");

let userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  fullname:{
    type: String,
    required: true,},
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,

  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "postDB",
    },
  ],
  dp: {
    type: String,
  },
});

userSchema.plugin(plm);
module.exports = mongoose.model("userDB", userSchema);
