import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./Configs/CloudinaryConfig.js";

const router = express.Router();

// setup multer storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // cloudinary folder
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

// Upload endpoint
router.post("/", upload.single("image"), (req, res) => {
  res.json({
    url: req.file.path, // Cloudinary URL
    public_id: req.file.filename,
  });
});

export default router;
