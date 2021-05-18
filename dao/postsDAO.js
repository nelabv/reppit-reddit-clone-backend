import mongodb from "mongodb"

const ObjectId = mongodb.ObjectID;
let threads;

export default class PostsDAO {
  static async initializeDB(conn) {
    if (threads) {
      return
    }
    try {
      threads = await conn.db(process.env.REDDITCLONE_NS).collection("posts");
        // Initialize the connection with the specific database above.
    } catch (e) {
      console.error(`Error in PostsDAO initializeDB: ${e}`);
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
      // Write the queries here if there is a query
      cursor = await threads.find(query);
      // Leave the .find() parameter blank if there is no query
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
}