import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: String,
  dateCreated: Object,
  votes: [{
    postID: Number,
    vote: Boolean
  }]
});

const User = mongoose.model("User", userSchema);

export default User;