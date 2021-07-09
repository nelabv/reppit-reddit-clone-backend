import express from "express";
import Utility from "./utils.js";
import PostsController from "./posts.controller.js";
import UsersController from "./users.controller.js";

const router = express.Router();

// ---------------
// USER ROUTES
// ---------------

router.route("/get-user")
  .get(Utility.verifyAndPassData, UsersController.APIfetchUserInformation)

router.route("/register")
  .post(UsersController.APIregisterUser)

router.route("/login")
  .post(UsersController.APIsignIn)

// ---------------
// MAIN THREAD ROUTES
// ---------------

router.route("/categories")
  .get(PostsController.APIgetCategories)

router.route("/posts-category")
  .get(PostsController.APIgetPostsByCategory)

router.route("/")
  .get(PostsController.APIgetPosts);
router.route("/:id")
  .get(Utility.verifyToken, PostsController.APIgetPostByID);

router.route("/posts")
  .post(Utility.verifyToken, PostsController.APIaddPost) 
  .put(Utility.verifyAndPassData, PostsController.APIcastVote)
  .delete(Utility.verifyToken, PostsController.APIdeletePost)

router.route("/comment/:id") 
  .put(Utility.verifyAndPassData, PostsController.APIaddComment)

export default router;