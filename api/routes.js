import express from "express";
import PostsController from "./posts.controller.js";
import UsersController from "./users.controller.js";

const router = express.Router();

router.route("/").get(PostsController.APIgetPosts);
router.route("/:id").get(PostsController.APIgetPostByID);

router
  .route("/posts")
  .post(PostsController.APIaddPost)
  .put(PostsController.APIupvoteDownvote)
  .delete(PostsController.APIdeletePost)

router
  .route("/comment/:id")
  .put(PostsController.APIaddComment)

router 
  .route("/register")
  .post(UsersController.APIregisterUser)

router
  .route("/login")
  .post(UsersController.APIauthenticate)

export default router;