import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    MainHeading: {
        type: String,
        require: true,
    },
    ImageUrl: {
        type: String,
        require: true,
    },
    MainBody: {
        type: String,
        require: true,
    }
}, {
    timestamps: true
})

const BlogModal = mongoose.model("Blogs", BlogSchema)

export default BlogModal