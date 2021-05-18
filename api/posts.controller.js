import PostsDAO from "../dao/postsDAO.js";

export default class PostsController {
  static async APIgetPosts(req, res, next) {
    try {
      let filters = {};
  
      if (req.query.flair) {
        filters.flair = req.query.flair;
      }

      const _results = await PostsDAO.fetchPosts({filters});

      let response = {
        contents: _results,
        filters: filters
      }

      res.json(response);
    } catch (e) {
      console.error(`Error in PostsController APIgetPosts: ${e}`);
    }
  }

  static async APIgetPostByID(req, res, next) {
    try {
      const postID = req.params.id;
      const post = await PostsDAO.getPostByID(postID);

      if (!post) {
        res.status(404).json({
          error: "Post not found",
          id: postID
        });
      }
      res.json(post);
    } catch (e) {
      console.error(`Error in PostsController APIgetPostByID: ${e}`);
    }
  }

  static async APIaddPost(req, res, next) {
    try {
      const title = req.body.title;
      const _body = req.body.body;
      const user = req.body.user_name;
      const flair = req.body.flair;

      const PostDocument = await PostsDAO.addPost(
        title, _body, user, flair
      )

      res.json({ status: "Post submitted!"});
    } catch (e) {
      console.error(`Error in PostsController APIaddPost: ${e}`);
    }
  }

  static async APIupvoteDownvote(req, res, next) {
    try {
      const rate = req.body.rate;
      const postId = req.params.id;

      const rating = await PostsDAO.upvoteDownvote(rate, postId);
      
    } catch(e) {
      console.error(`Error in PostsController APIupvoteDownvote: ${e}`);
    }
  }
}