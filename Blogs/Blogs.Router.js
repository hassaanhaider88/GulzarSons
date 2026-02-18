import express from 'express';
import { SendAllBlogs, AddNewBlogs, UpdateBlog, DeleteBlog, SendSingBlog } from './Blogs.Controller.js';

const router = express.Router();

router.get("/", SendAllBlogs);

router.post("/create", AddNewBlogs)

router.post("/update", UpdateBlog)

router.post("/delete",DeleteBlog)

router.get("/:id",SendSingBlog)

export default router;