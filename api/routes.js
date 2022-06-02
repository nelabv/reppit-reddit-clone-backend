import express from "express";
import Utility from "./utils.js";
import PostsController from "./posts.controller.js";
import UsersController from "./users.controller.js";

const router = express.Router();

router.route("/")  
  .get((req, res) => {
    res.json({
      message: "Reddit clone API",
      author: "nbv2021"
    })
  });

router.route("/register")
  .post(UsersController.APIregisterUser);

router.route("/login") 
  .post(UsersController.APIlogin);

router.route("/posts") // Fetch all posts
  .get(PostsController.APIgetPosts)
  .post(Utility.verifyToken, PostsController.APIaddPost);

router.route("/posts")
  .put(Utility.verifyAndPassData, PostsController.APIcastVote);

router.route("/posts/:id")
  .get(PostsController.APIgetPostByID)
  .delete(Utility.verifyToken, PostsController.APIdeletePost);

router.route("posts/comment/:id") 
  .put(Utility.verifyAndPassData, PostsController.APIaddComment);

/* router.route("/categories")
  .get(PostsController.APIgetCategories)

router.route("/get-user")
  .get(Utility.verifyAndPassData, UsersController.APIfetchUserInformation) */

export default router;