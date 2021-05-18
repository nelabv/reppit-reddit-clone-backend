import express from "express";
import PostsController from "./posts.controller.js";

const router = express.Router();

router.route("/").get(PostsController.APIgetPosts);
router.route("/:id").get(PostsController.APIgetPostByID);

router
  .route("/posts")
  .post(PostsController.APIaddPost);

export default router;