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
      return await usersCollection.insertOne(userDetails);
    } catch(e) {
      console.error(`Error in UsersDAO registerUser: ${e}`);
    }
  }
}