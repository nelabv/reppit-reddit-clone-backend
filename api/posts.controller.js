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
      const postId = req.body.id;

      const rating = await PostsDAO.upvoteDownvote(rate, postId);
      
      res.json({ status: "Vote submitted!" })
    } catch(e) {
      console.error(`Error in PostsController APIupvoteDownvote: ${e}`);
    }
  }

  static async APIdeletePost(req, res, next) {
    try {
      const postID = req.body.postID;
      const userID = req.body.user;

      const deletePost = await PostsDAO.deletePost(postID, userID);

      res.json({ status: "Post deleted!"});
    } catch(e) {
      console.error(`Error in PostsController APIdeletePost: ${e}`);
    }
  }

  static async APIaddComment(req, res, next) {
    try {
      const post = req.params.id;
      const user = req.body.username;
      const commentBody = req.body.comment;

      const addComment = await PostsDAO.addComment(post, user, commentBody);
      res.json({ status: "Comment submitted!"});
    } catch(e) {
      console.error(`Error in PostsController APIaddComment: ${e}`);
    }
  }
}