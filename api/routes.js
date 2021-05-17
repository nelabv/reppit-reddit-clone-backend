import express from "express";
import PostsController from "./posts.controller.js";

const router = express.Router();

router.route("/").get(PostsController.APIgetPosts);

export default router;