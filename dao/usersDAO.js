import { response } from "express";
import mongodb from "mongodb"

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

  static async login(_username, _password) {

    // progress: able to find number of usernames that exists in the database
    const databaseCall = await usersCollection.countDocuments({ username: _username});

    return {databaseCall};
  }
}