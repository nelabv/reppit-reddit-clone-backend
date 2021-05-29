import bcrypt, { hash } from "bcrypt";
import { response } from "express";
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

  static async checkUser(_username, _password) {
    const query = { username: _username};
    
    const cursor = await usersCollection.find(query);
    const response = await cursor.toArray();
    if (response.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  static async checkPassword(_username, _password) {
    const query = { username: _username};
    const userData = await usersCollection.find(query).toArray();

    function compareAsync(password, hashedPW) {
      return new Promise(function(resolve, reject) {
        bcrypt.compare(password, hashedPW, function(error, result) {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    }
  
    const res = await compareAsync(_password, userData[0].password);
    return res;
  }
  
}