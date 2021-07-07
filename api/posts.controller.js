import PostsDAO from "../dao/postsDAO.js";
import UsersDAO from "../dao/usersDAO.js";
import Post from "../model/post.js";

export default class PostsController {
  static async APIgetPosts(req, res, next) {
    try {
      let filters = {};
  
      if (req.query.flair) {
        filters.flair = req.query.flair;
      }

      const _results = await PostsDAO.fetchPosts({filters});

      let response = {
        filters: filters,
        contents: _results
      }

      res.json(response);
    } catch (e) {
      console.error(`Error in PostsController APIgetPosts: ${e}`);
    }
  }

  static async APIgetPostsByCategory(req, res, next) {
    try {    
      const category = req.body.category;

      const results = await PostsDAO.getPostsByCategory(category);

      res.json({
        results
      })
    } catch (err) {
      console.log(`Error in PostsController APIsetCategories: ${err}`);

      res.status(400).json({
        error: err
      })
    }
  }
  
  static async APIgetCategories(req, res, next) {
    try {
      let categories = await PostsDAO.getCategories();
      res.status(200).json({
        categories
      });
    } catch (e) {
      console.log(`Error in PostsController APIgetCategories: ${e}`)
      res.status(500).json({ error: e });
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
      res.status(200).json(post);
    } catch (e) {
      console.error(`Error in PostsController APIgetPostByID: ${e}`);
    }
  }

  static async APIaddPost(req, res, next) {
    try {
      const newPost = new Post({
        title: req.body.title,
        author: req.body.username,
        body: req.body.body,
        datePosted: new Date(),
        category: req.body.flair,
        comments: [],
        votes: {
          totalVoteCount: 0, 
          upvotes: [],
          downvotes: []
        }
      })

      const PostDocument = await PostsDAO.addPost(newPost);
      
      res.status(200).json({
        status: "Post submitted!",
        id: PostDocument
      });
    } catch (err) {
      console.error(`Error in PostsController APIaddPost: ${err}`);

      res.status(400).json({
        error: err
      })
    }
  }

  static async APIdeletePost(req, res, next) {
    try {
      const postID = req.body.postID;

      const deletePost = await PostsDAO.deletePost(postID);

      res.status(200).json({ status: "Post deleted!"});
    } catch(err) {
      console.error(`Error in PostsController APIdeletePost: ${err}`);
      
      res.status(400).json({
        error: `Unable to delete post: ${err}`
      })
    }
  }

  static async APIaddComment(userData, req, res, next) {
    try {
      const commentDocument = {
        user: userData.user.username,
        body: req.body.body,
        date: new Date() 
      }

      const addComment = await PostsDAO.addComment(commentDocument, req.body.postID);
      res.json({ status: "Comment submitted!"});
    } catch(e) {
      console.error(`Error in PostsController APIaddComment: ${e}`);
    }
  }

  static async APIcastVote(userData, req, res, next) {
    try {
      const postID = req.body.id;
      const vote = req.body.vote;
      const user = userData.user.username;
  
      const results = await PostsDAO.castVote(postID, user, vote);
      
      res.json(results);
    } catch (err) {
      res.status(400).json({
        error: `Error in PostsController APIcastVote: Unable to cast vote: ${err}`
      })
    }
  }
}