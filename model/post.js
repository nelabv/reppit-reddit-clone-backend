import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  body: String,
  datePosted: Object,
  category: String,
  comments: [
    {
      user: String,
      body: String,
      date: Object
    }
  ],
  votes: {
    totalVoteCount: Number, 
    upvotes: [ String ],
    downvotes: [ String ]
  }
});

const Post = mongoose.model("Post", postSchema);

export default Post;