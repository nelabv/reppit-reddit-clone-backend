import jwt from "jsonwebtoken";
import mongodb from "mongodb";
import PostsDAO from "../dao/postsDAO.js";
const ObjectId = mongodb.ObjectID;

export default class Utility {
  static verifyToken (req, res, next) {
    const header = req.headers['authorization'];

    if (typeof header !== 'undefined') {
      const bearer = header.split(' ');
      const token = bearer[1];
      
      jwt.verify(token, process.env.SECRET_KEY, (error, verificationData) => {
        if (error) {
          res.redirect("/");
        } else {
          next();
        }
      })
    } else {
      res.status(403).json({
        error: "Not logged in"
      })
    }
  }

  static verifyAndPassData (req, res, next) {
    const header = req.headers['authorization'];

    if (typeof header !== 'undefined') {
      const bearer = header.split(' ');
      const token = bearer[1];
      
      jwt.verify(token, process.env.SECRET_KEY, (error, verificationData) => {
        if (error) {
          res.redirect("/");
        } else {
          next(verificationData);
        }
      })
    } else {
      res.status(403).json({
        error: "Not logged in"
      })
    }
  }

  static updateTotalCount = async (id, threads) => {
    const post = await threads.find({
      _id: ObjectId(id)
    }).toArray();

    let numberOfDownvotes = post[0].votes.downvotes.length;
    let numberOfUpvotes = post[0].votes.upvotes.length;

    const voteCount = numberOfUpvotes - numberOfDownvotes;

    console.log("UPVOTES LENGTH: ", numberOfUpvotes);
    console.log("DOWNVOTES LENGTH: ", numberOfDownvotes);
    console.log("VOTE COUNT: ", voteCount);

    return await threads.updateOne(
      { _id: ObjectId(id) },
      { $set: { "votes.totalVoteCount" : voteCount}}
    );
  }

  static async castInitialVote (id, username, vote) {
    PostsDAO.castVote(id, username, vote);
  }
}