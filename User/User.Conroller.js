import UserModal from "./User.Modal.js";

export const SaveUserToDB = async (req, res) => {
  try {
    var { UName, UEmail, UPhoneNo, UMessage } = req.body;
    var IsUserExist = await UserModal.find({ UEmail });

    if (IsUserExist.length > 0) {
      res.send({
        data: IsUserExist,
        success: false,
        messege : "User Already Exist"
      });
    } else {
      var User = await UserModal.create({
        UName,
        UEmail,
        UPhoneNo,
        UMessage,
      });

      res.send({
        data: User,
        success: true,
        messege : "Your Message Sent Successfully"
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      data: error,
      success: false,
      messege : "User Not Created"
    });
  }
};
