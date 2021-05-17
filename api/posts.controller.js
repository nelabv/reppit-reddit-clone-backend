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
        posts: _results,
        filters: filters
      }

      res.json(response);
    } catch (e) {
      console.error(`Error in PostsController: Unable to get posts from DB: ${e}`);
    }
  }
}