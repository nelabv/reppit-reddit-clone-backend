import mongodb from "mongodb";
import Utility from "../api/utils.js";

const ObjectId = mongodb.ObjectID;
let threads;

export default class PostsDAO {
  static async initializeDB(conn) {
    if (threads) {
      return
    }
    try {
      threads = await conn.db(process.env.REDDITCLONE_NS).collection("posts");
    } catch (e) {
      console.error(`Error in PostsDAO initializeDB: ${e}`);
    }
  }

  static async getPostsByCategory(_category) {
    let data;
    const query = { "category": { $eq: _category }}

    try {
      data = await threads.find(query);
      const response = await data.toArray();
      return response;
    } catch(e) {
      console.error(`Error in PostsDAO getPostByID: ${e}`);
    }
  }

  static async getCategories() {
    let categories = [];
    try {
      categories = await threads.distinct("category");
      return categories;
    } catch (e) {
      console.error(`Error in PostsDAO getCategories: ${e}`)
      return categories;
    }
  }

  static async fetchPosts({
    filters = null
  } = {}) {
    let query; 
    
    if (filters) {
      if ("flair" in filters) {
        query = { "flair": { $eq: filters["flair"] } }
      }
    }

    let cursor; 
    
    try {
      cursor = await threads.find(query);
      const posts = await cursor.toArray();
      return { posts };
    } catch (e) {
      console.error(`Error in PostsDAO fetchPosts: ${e}`);
    }
  }

  static async getPostByID(id){
    let data;
    const query = {
      _id : ObjectId(id)
    }

    try {
      data = await threads.find(query);
      const retrievedPost = await data.toArray();
      return { retrievedPost };
    } catch(e) {
      console.error(`Error in PostsDAO getPostByID: ${e}`);
    }
  }

  static async castVote(postID, username, vote) {
    let array; 
    try {
      if (vote === true) {
        array = "upvotes"
      } else if (vote === false) {
        array = "downvotes"
      }
    } catch (error) {
      console.log(`Error in PostsDAO, unable to assign variable: ${error}`);
    }

    const upvotesSearch = await threads.find({ 
      _id: ObjectId(postID),
      "votes.upvotes": username 
    }).toArray();

    const downvotesSearch = await threads.find({ 
      _id: ObjectId(postID),
      "votes.downvotes": username 
    }).toArray();
    
    if (upvotesSearch.length > 0) {
      threads.updateOne(
        { _id: ObjectId(postID)}, 
        { $pull: { "votes.upvotes" : username } }
      )
    } else if (downvotesSearch.length > 0) {
      threads.updateOne(
        { _id: ObjectId(postID)}, 
        { $pull: { "votes.downvotes" : username } }
      )
    }

    const castVote = await threads.updateOne(
      { _id: ObjectId(postID)}, 
      { $push: { [`votes.${array}`] : username } }
    ) 

    Utility.updateTotalCount(postID, threads);
    
    return castVote;
  }

  static async addPost(newPost) {
    try {
      const newlyAddedPost = await threads.insertOne(newPost, async function (error, result) {
        if (error) {
          console.log(error);
        } else {
          const postId = result.ops[0]._id;
          const author = result.ops[0].author;

          threads.updateOne(
            { _id: ObjectId(postId)}, 
            
            { $inc : {"votes.totalVoteCount" : 1},
            $push: { "votes.upvotes" : author } }
          )

          Utility.updateTotalCount(postId, threads);
        }
      });
      return newlyAddedPost;
    } catch (e) {
      console.error(`Error in PostsDAO addPost: ${e}`);
    }
  }

  static async upvoteDownvote(rate, id) {
    let retrievedPost;
    const query = {
      _id: ObjectId(id)
    };

    try {
      let data = await threads.find(query);
      retrievedPost = await data.toArray();

      if (rate === true) {
        const update = await threads.updateOne(query, {
          $inc: { rating: 1}
        })
      } if (rate === false) {
        const update = await threads.updateOne(query, {
          $inc: { rating: -1}
        })
      }
    } catch (e) {
      console.error(`Error in PostsDAO upvoteDownvote: ${e}`);
    }

  }

  static async deletePost(postId, userId) {
    try {
      const deletePost = await threads.deleteOne({
        _id: ObjectId(postId),
        user: userId
      })
      return deletePost;
    } catch(e) {
      console.error(`Error in PostsDAO deletePost: ${e}`);
    }
  }

  static async addComment(commentDoc, postId) {
    try {
      const addCommentReq = await threads.updateOne(
        { _id: ObjectId(postId) },
        { $push: { comments: commentDoc } }
      )

      return addCommentReq;
    } catch(e) {
      console.error(`Error in PostsDAO addComment: ${e}`);
    }
  }
}