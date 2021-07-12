import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongodb from "mongodb";

const ObjectId = mongodb.ObjectID;
let usersCollection;

export default class UsersDAO {
  static async initializeDB(conn) {
    if (usersCollection) {
      return
    }
    try {
      usersCollection = await conn.db(process.env.REDDITCLONE_NS).collection("users");
      // usersCollection.deleteMany({})
    } catch (e) {
      console.error(`Error in PostsDAO initializeDB: ${e}`);
    }
  }

  static async registerUser(userDetails) {
    try {
      const checkUsername = await usersCollection.countDocuments({ username: userDetails.username});
      
      if(checkUsername === 1) {
        return checkUsername;
      } else {
        return await usersCollection.insertOne(userDetails);
      }      
    } catch(e) {
      console.error(`Error in UsersDAO registerUser: ${e}`);
    }
  }

  static async validateUser(_username, _password) {
    const query = { username: _username};
    
    const cursor = await usersCollection.find(query);
    const response = await cursor.toArray();
    if (response.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  static async validatePassword(_username, _password) {
    const query = { username: _username};
    const userData = await usersCollection.find(query).toArray();

    function checkPassword(password, hashedPW) {
      return new Promise(function(resolve, reject) {
        bcrypt.compare(password, hashedPW, function(error, result) {
          if (error) {
            reject(error);
            return false;
          } else {
            resolve(result);
            return true;
          }
        });
      });
    }
  
    const res = await checkPassword(_password, userData[0].password);
    return res;
  }

  static async grantAccess(_username) {
    const user = {
      username: _username,
      date: new Date()
    }

    function generateToken(_user) {
      return new Promise( function(resolve, reject) {
        jwt.sign(
          { user },
          process.env.SECRET_KEY,
          { expiresIn: '2hr'},
          (err, token) => {
            if (err) {
              reject(err);
            } else {
              resolve(token);
            }
          }
        )
      });
    }

    const token = await generateToken(user);
    return token;
  }

  static async fetchUserInformation(username) {
    const query = {
      username : username
    }

    try {
      return await usersCollection.find(query).toArray();

    } catch(e) {
      console.error(`Error in PostsDAO getPostByID: ${e}`);
    }
  }



  // INTERFUNCTIONS -------------------

  // If vote is successful, add post details to UsersCollection database.

  static async addRatingToUserData(user, post, rating, DBaction){
    // DBaction is a boolean whether there is need to pull or push to the UsersCollection.
    if (DBaction === true) {
      const removeVote = await usersCollection.updateOne(
        { username: user},
        { $pull: { votes: { post: post } }}
      )

      const addVote = await usersCollection.updateOne(
        { username: user},
        { $push: { votes : {post: post, vote: rating} }}
      )

      return addVote;
    } else if (DBaction === false) {
      const addVote = await usersCollection.updateOne(
        { username: user},
        { $push: { votes : {post: post, vote: rating} }}
      )

      return addVote;
    } else if (DBaction === "unvote") {
      const removeVote = await usersCollection.updateOne(
        { username: user},
        { $pull: { votes: { post: post } }}
      )

      return removeVote;
    }
  }
}