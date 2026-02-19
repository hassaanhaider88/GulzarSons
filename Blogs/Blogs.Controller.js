import { marked } from "marked";

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
    const { id } = req.params;

    const blog = await BlogModal.findById(id);

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    const htmlContent = marked.parse(blog.MainBody || "");

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${blog.MainHeading}</title>
       <link rel="icon" type="image/x-icon" href="https://gulzarsonsfurniture.com/assets/final.png" />
        <meta name="description" content="${blog.MainHeading}" />

        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            line-height: 1.7;
            color: #333;
          }

          .container {
            margin: 40px;
            background: #fff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          }
            
            .BackArrow{
            height: 40px;
            width : 40px;
            display : flex;
            align-items: center;
            justify-content: center;
            background : #F5A425;
            border-radius : 100%;
            color : white;
            position: absolute;
            left: 25px;
            top: 25px;
            cursor: pointer;
            transition : all;
            }
            .BackArrow:hover{
            scale: .95;
            }

          .blog-image {
            width: 100%;
            height: 400px;
            border-radius: 6px;
            margin-bottom: 30px;
            
          }

          h1 {
            font-size: 32px;
            margin-bottom: 20px;
          }

          h2 {
            font-size: 26px;
            margin-top: 30px;
          }

          h3 {
            font-size: 22px;
            margin-top: 25px;
          }

          p {
            margin-bottom: 18px;
          }

          ul {
            margin-bottom: 20px;
            padding-left: 20px;
          }

          li {
            margin-bottom: 8px;
          }

          strong {
            font-weight: bold;
          }

          img {
            max-width: 100%;
            height: auto;
          }
        </style>
      </head>

      <body>
        <div class="container">
         <span class="BackArrow">
         <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" class="copy-svg-injected"><path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path></svg></span>
          <img 
            src="${blog.ImageUrl}" 
            alt="${blog.MainHeading}" 
            class="blog-image"
          />

          <h1>${blog.MainHeading}</h1>

          <div class="blog-content">
            ${htmlContent}
          </div>

        </div>

      </body>
      <script>
      const ArrowBtn = document.getElementsByClassName("BackArrow");
      ArrowBtn[0].addEventListener("click",()=>{
        window.history.back()
        })
      </script>
      </html>
    `);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
