import mongodb from "mongodb"

const ObjectId = mongodb.ObjectID;
let threads;

export default class PostsCheckers {
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

  static async ifUserHasVotedAlready(id, voteDocument, votelocation) {
    try {
      const query = { _id: ObjectId(id), [`votes.${votelocation}`] : voteDocument };
      const post = await threads.find(query);
      await post.forEach(console.dir);
    } catch (error) {
      console.log(`Error in PostsCheckers: ${error}`);
    }
  }
}