let mongoose = require("mongoose");
let plm = require("passport-local-mongoose");

let postSchema = mongoose.Schema({
  posttext: {
    type: String,
  },
  posturl : {
    type:String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userDB",
  },
  createdtime: {
    type: Date,
    default: Date.now,
  },
  likes: [],
});
// postSchema.plugin(plm);

module.exports = mongoose.model("postDB",postSchema);