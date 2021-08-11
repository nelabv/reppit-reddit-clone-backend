import express from "express";
import Utility from "./utils.js";
import PostsController from "./posts.controller.js";
import UsersController from "./users.controller.js";

const router = express.Router();

// ---------------
// USER ROUTES
// ---------------

router.route('/', (req, res) => {   
  res.status(200).send({message: "Hello!"}); 
});

router.route("/get-user")
  .get(Utility.verifyAndPassData, UsersController.APIfetchUserInformation)

router.route("/register")
  .post(UsersController.APIregisterUser)

router.route("/login")
  .post(UsersController.APIsignIn)

// ---------------
// POST ACTIVITY ROUTES - all requests concerning actions on post threads
// ---------------

router.route("/posts")
.put(Utility.verifyAndPassData, PostsController.APIcastVote)
.post(Utility.verifyToken, PostsController.APIaddPost) 
.delete(Utility.verifyToken, PostsController.APIdeletePost)

router.route("/comment/:id") 
.put(Utility.verifyAndPassData, PostsController.APIaddComment)

// ---------------
// MAIN THREAD ROUTES - all requests concerning post threads, etc
// ---------------

router.route("/categories")
  .get(PostsController.APIgetCategories)

router.route("/")
  .get(PostsController.APIgetPosts);
router.route("/:id")
  .get(Utility.verifyToken, PostsController.APIgetPostByID);

export default router;