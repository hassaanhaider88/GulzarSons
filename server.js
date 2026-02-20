import express from "express";
import ConnectDB from "./Configs/MongoDBConfig.js";
import donenv from "dotenv";
import PRouter from "./Products/Product.Router.js";
import ImgUploaderRouter from "./ImageUploader.Router.js";
import SaveUserRouter from "./User/User.Router.js";
import offersRoutes from "./Offers/Offers.Router.js";
import OrderRoutes from "./Orders/Order.Router.js";
import sendGoogleReviews from './Services/SendGoogleReviews.js'
import BlogRoutes from './Blogs/Blogs.Router.js'
import cors from "cors";
import requestLogger from "./Services/RequestLogger.js";
import { SendSingBlog } from "./Blogs/Blogs.Controller.js";
donenv.config();
const app = express();
app.use(cors());

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

var PORT = process.env.PORT || 8800;
ConnectDB();

app.use(requestLogger)

app.get("/", (req, res) => {
  res.send("Gulzar And Sons APIs Working Well and Good");
});

app.post("/api/admin-login", (req, res) => {
  var { emailInput, passwordInput } = req.body;

  if (
    emailInput == process.env.ADMIN_EMAIL &&
    passwordInput == process.env.ADMIN_PASSWORD
  ) {
    res.json({ message: "Login Successfull", success: true });
  } else {
    res.json({ message: "Login Failed", success: false });
  }
});


// single blog send SSR
app.get("/blogs/:id", SendSingBlog)



app.use("/api/products", PRouter);
app.use("/api/upload-img", ImgUploaderRouter);
app.use("/api/users", SaveUserRouter);
app.use("/api/offers", offersRoutes);
app.use('/api/orders', OrderRoutes);
app.use('/api/send-google-reviews', sendGoogleReviews)

app.use("/api/blogs", BlogRoutes)

app.listen(PORT, () => console.log(`API is running on port ${PORT}`));
