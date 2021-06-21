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
          { expiresIn: '1hr'},
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

  // -----------------------------

  static async checkIfUserVoted (user, _postId) {
    const cursor = await usersCollection.find({username: user});
    const userData = await cursor.toArray();
    const ratedPosts = userData[0].ratedPosts;

    return ratedPosts.some(rated => rated.post === _postId);
  }

  static async addRatingToUserData(user, postID, rating){
    usersCollection.updateOne(
      { username: user},
      { $push: {
          ratedPosts : {
            post: postID,
            rate: rating
          }
        }
      }
    )
  }

  // testing

  static async registerUserTEST(userDetails) {
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
}