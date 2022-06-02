import mongodb from "mongodb";
import UsersDAO from "./usersDAO.js";

const ObjectId = mongodb.ObjectID;
let threads;

export default class PostsDAO {
  static async initializeDB(conn) {
    if (threads) {
      return
    }
    try {
      threads = await conn.db(process.env.REDDITCLONE_NS).collection("posts");
      //threads.deleteMany({})

    } catch (e) {
      console.error(`Error in PostsDAO initializeDB: ${e}`);
    }
  }

  static async getCategories() {
    let response = [];
    
    try {
      return await threads.distinct("category");
      //return response;
    } catch (e) {
      console.error(`Error in PostsDAO getCategories: ${e}`)
      return categories;
    }
  }

  static async fetchPosts(filter) {
    let query; 
    let cursor; 

    if (filter) {
      query = { category: `${filter}`}
    }

    cursor = await threads.find(query);
    return await cursor.toArray();
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
        array = "upvotes";
      } else if (vote === false) {
        array = "downvotes";
      }
    } catch (error) {
      console.log(`Error in PostsDAO castVote: Unable to assign variable: ${error}`);
    }


    let upvotesSearch;
    let downvotesSearch;

    try {
      upvotesSearch = await threads.find({ 
        _id: ObjectId(postID),
        "votes.upvotes": username 
      }).toArray();
  
      downvotesSearch = await threads.find({ 
        _id: ObjectId(postID),
        "votes.downvotes": username 
      }).toArray();
    } catch (err) {
      console.log(`Error in PostsDAO castVote: ${err}`);
    }

    let response;
    // Check if user has voted the same vote already
    if ((upvotesSearch.length > 0 && vote === true) || (downvotesSearch.length > 0 && vote === false)) { 
      threads.updateOne(
        { _id: ObjectId(postID)}, 
        { 
          $pull: { [`votes.${array}`] : username },
          $inc: {[`votes.totalVoteCount`]: -1}
        }
      )

      const user = await UsersDAO.addRatingToUserData(username, postID, vote, "unvote");
      
      response = {
        status: "unvote",
        message: "UNVOTE: User unvoted on this post"
      }

      return response;
    } else if (upvotesSearch.length > 0 && vote !== true) { 
      threads.updateOne(
        { _id: ObjectId(postID)}, 
        { 
          $pull: { "votes.upvotes" : username },
          $push: { "votes.downvotes" : username }
        }
      ) 

      const user = await UsersDAO.addRatingToUserData(username, postID, vote, true);

      response = {
        status: "change vote",
        message: "VOTE CHANGE ( + to - ): User has existing record but requested to change vote.",
        user
      }
      return response;
    } 
    
    
    else if (downvotesSearch.length > 0 && vote !== false) {
      threads.updateOne(
        { _id: ObjectId(postID)}, 
        { 
          $pull: { "votes.downvotes" : username },
          $push: { "votes.upvotes" : username }
        }
      )  

      const user = await UsersDAO.addRatingToUserData(username, postID, vote, true);

      response = {
        status: "change vote",
        message: "VOTE CHANGE ( - to + ): User has existing record but requested to change vote.",
        user
      }
      return response;
    } else {
      try {
          threads.updateOne(
            { _id: ObjectId(postID)}, 
            { 
              $push: { [`votes.${array}`] : username },
              $inc: {[`votes.totalVoteCount`]: 1}
            }
          )
    
          const user = await UsersDAO.addRatingToUserData(username, postID, vote, false);
    
          response = {
            status: "added record",
            message: "RECORD ADDED: User has no existing record on this post. Added user to votes array successfully.",
            user
          }

          return response;
        } catch (error) {
          response = {
            error: `An error occurred: ${error}`
          }
          return response;
        }
      } 
    
  
  }

  static async addPost(newPost) {
    function handleSubmit(_newPost) {
      return new Promise (function(resolve, reject) {
        threads.insertOne(newPost, function(error, result) {
          if (error) {
            reject();
          } else {
            const postId = result.ops[0]._id;
            const author = result.ops[0].author;

            threads.updateOne(
              { _id: ObjectId(postId)}, 
              { $inc : {"votes.totalVoteCount" : 1},
              $push: { "votes.upvotes" : author } }
            );

            UsersDAO.addRatingToUserData(author, postId, true, false);
            
            resolve(postId);
          }
        })
      })
    }

    const id = await handleSubmit(newPost);
    return id;
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

  static async addComment(commentBody, postId) {
    try {
      const addCommentReq = await threads.updateOne(
        { _id: ObjectId(postId) },
        { $push: { comments: commentBody } }
      )

      return addCommentReq;
    } catch(e) {
      console.error(`Error in PostsDAO addComment: ${e}`);
    }
  }
}