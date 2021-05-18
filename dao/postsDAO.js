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

  static async addPost(_title, _body, _user, _flair) {
    try {
      const postDoc = {
        title: _title,
        body: _body,
        user: _user,
        flair: _flair,
        datePosted: new Date(),
        rating: 1,
        comments: []
      }

      return await threads.insertOne(postDoc);
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
        const update = await threads.update(query, {
          $inc: { rating: 1}
        })
      } if (rate === false) {
        const update = await threads.update(query, {
          $inc: { rating: -1}
        })
      }
    } catch (e) {
      console.error(`Error in PostsDAO upvoteDownvote: ${e}`);
    }

  }
}