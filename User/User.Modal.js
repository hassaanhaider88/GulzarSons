import mongoose from "mongoose";

var UserSchema = mongoose.Schema({
  UName: String,
  UEmail: String,
  UPhoneNo: Number,
  UMessage: String,
});

var UserModal = mongoose.model('User',UserSchema)

export default UserModal;