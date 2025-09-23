import express from "express";
import { SaveUserToDB } from "./User.Conroller.js";

const route = express.Router();

route.post('/',SaveUserToDB);

export default route;