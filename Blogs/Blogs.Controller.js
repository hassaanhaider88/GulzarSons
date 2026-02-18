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

// export async function SendSingBlog(req, res) {
//     try {
//         const { id } = req.params;

//         const blog = await BlogModal.findById(id);

//         if (!blog) {
//             return res.status(404).send("Blog not found");
//         }

//         let cleanedBody = blog.MainBody
//             .replace(/\* /g, "\n- ")
//             .replace(/MainHeading:/g, "\n# ")
//             .replace(/MainBody:/g, "\n")
//             .replace(/\*\*/g, "\n**");


//         const htmlContent = marked(cleanedBody);

//         res.send(`
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>${blog.MainHeading}</title>
//         <meta name="description" content="${blog.MainHeading}" />
//         <script src="https://cdn.tailwindcss.com"></script>
//       </head>

//       <body class="bg-gray-100">
//         <div class="max-w-4xl mx-auto bg-white shadow-md rounded-xl mt-10 p-8">

//           <!-- Blog Image -->
//           <img 
//             src="${blog.ImageUrl}" 
//             alt="${blog.MainHeading}" 
//             class="w-full h-96 object-cover rounded-lg mb-8"
//           />

//           <!-- Blog Heading -->
//           <h1 class="text-4xl font-bold mb-6 text-gray-900">
//             ${blog.MainHeading}
//           </h1>

//           <!-- Blog Body -->
//           <div class="prose prose-lg max-w-none text-gray-700">
//             ${htmlContent}
//           </div>

//         </div>
//       </body>
//       </html>
//     `);
//     } catch (error) {
//         return res.json({
//             success: false,
//             message: error.message,
//         });
//     }
// }


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
            max-width: 900px;
            margin: 40px auto;
            background: #fff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          }

          .blog-image {
            width: 100%;
            height: auto;
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
      </html>
    `);

  } catch (error) {
    res.status(500).send(error.message);
  }
}