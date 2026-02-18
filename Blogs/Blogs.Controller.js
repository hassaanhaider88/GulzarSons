import { set } from "mongoose";
import BlogModal from "./Blogs.modal.js";
export async function SendAllBlogs(req, res) {
    try {
        const AllBlogs = await BlogModal.find();
        if (!AllBlogs) {
            return res.json({
                success: false,
                message: "Something Went Wrong on Server",
            });
        }
        return res.json({
            success: true,
            message: "Fetch  Blogs Success",
            data: AllBlogs,
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

export async function AddNewBlogs(req, res) {
    try {
        const { Heading, ImgUrl, BlogBody } = req.body;
        if (!Heading || !ImgUrl || !BlogBody) {
            return res.json({
                success: false,
                message: "Requrired all feilds",
            });
        }

        const Blog = await BlogModal.create({
            MainHeading: Heading,
            ImageUrl: ImgUrl,
            MainBody: BlogBody,
        });
        if (!Blog) {
            return res.json({
                success: false,
                message: "something wents wrong while posting blog",
            });
        }

        return res.json({
            success: true,
            message: "created Blog success",
            data: Blog,
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

export async function UpdateBlog(req, res) {
    try {
        const { Id, Heading, BlogBody } = req.body;

        if (!Id) {
            return res.json({
                success: false,
                message: "Please provide updated blog id",
            });
        }

        const updatedBlog = await BlogModal.findByIdAndUpdate(
            Id,
            {
                MainHeading: Heading,
                MainBody: BlogBody,
            },
            { new: true },
        );

        if (!updatedBlog) {
            return res.json({
                success: false,
                message: "Blog not found",
            });
        }

        return res.json({
            success: true,
            message: "Blog updated successfully",
            data: updatedBlog,
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
}


export async function DeleteBlog(req, res) {
    try {
        const { Id } = req.body;
        if (!Id) {
            return res.json({
                success: false,
                message: "Please provide updated blog id",
            });
        }

        const deletedBlog = await BlogModal.findByIdAndDelete(Id);

        if (!deletedBlog) {
            return res.json({
                success: false,
                message: "Blog not found",
            });
        }

        // Fetch remaining blogs
        const remainingBlogs = await BlogModal.find().sort({ createdAt: -1 });

        return res.json({
            success: true,
            message: "Blog deleted successfully",
            data: remainingBlogs,
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
}


export async function SendSingBlog(req, res) {
    try {
   
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}