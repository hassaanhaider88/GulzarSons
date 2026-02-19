import express from 'express';
import { SendAllBlogs, AddNewBlogs, UpdateBlog, DeleteBlog, SendSendBlogJson } from './Blogs.Controller.js';

const router = express.Router();

router.get("/", SendAllBlogs);

router.post("/create", AddNewBlogs)

router.post("/update", UpdateBlog)

router.post("/delete",DeleteBlog)


router.get("/single/:id",SendSendBlogJson)


export default router;