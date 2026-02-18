import express from 'express';
import { SendAllBlogs, AddNewBlogs, UpdateBlog, DeleteBlog } from './Blogs.Controller.js';

const router = express.Router();

router.get("/", SendAllBlogs);

router.post("/create", AddNewBlogs)

router.post("/update", UpdateBlog)

router.post("/delete",DeleteBlog)

export default router;