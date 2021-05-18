import express from "express";
import PostsController from "./posts.controller.js";

const router = express.Router();

router.route("/").get(PostsController.APIgetPosts);
router.route("/posts/:id").get(PostsController.APIgetPostByID);

export default router;