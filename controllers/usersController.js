const User = require("../models/User");
const fs = require("fs");
const createError = require("http-errors");
const { use } = require("../routes/users");
const nodemailer = require("nodemailer");
const { Types } = require("mongoose");
const { db } = require("../config/config");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .populate({
        path: "friendReq",
        select:
          "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
      })
      .populate({
        path: "event",
        select:
          "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
      })
      .populate({
        path: "group",
        select:
          "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
      })
      .populate({
        path: "friend",
        select:
          "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
      })
      .populate({
        path: "messagerUsers",
        select:
          "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
      })
      // .sort("lastName")
      .select("-password -__v -tokens._id  -role -updatedAt -createdAt");
    res.status(200).send(users);
  } catch (e) {
    next(e);
  }
};

exports.getOneUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: "friendReq",
        select:
          "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
      })
      .populate({
        path: "event",
        select:
          "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
      })
      .populate({
        path: "group",
        select:
          "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
      })
      .populate({
        path: "friend",
        select:
          "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
      })
      .populate({
        path: "messagerUsers",
        select:
          "-password -__v -tokens._id -email -role -updatedAt -createdAt -eventLike -event -friend -friendId -friendReq -friendReqId -group -groupLike -like -location -messagerUsers",
      })
      .select("-password -__v");
    if (!user) throw new createError.NotFound();
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    // What happens when an Admin want to delete a User's account??
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new createError.NotFound();
    res
      .status(200)
      .send({ message: " The User is deleted ", user })
      .select("-password");
  } catch (e) {
    next(e);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) throw new createError.NotFound();
    const data = user.getPublicFields();
    res.status(200).send({ message: " The User data is Updated " });
  } catch (e) {
    next(e);
  }
};

exports.updateUserImage = async (req, res, next) => {
  try {
    const image = await User.findOne({ _id: req.user._id });
    const useImage = image.imgCollection;
    for (var i = 0; i < useImage.length; i++) {
      // deleting the files works perfectly
      const file = useImage[i].slice(36);
      fs.unlink(`public/images/${file}`, async () => {});
    }

    const reqFiles = [];
    const url = "http://" + req.get("host");
    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(url + "/static/images/" + req.files[i].filename);
    }
    const user = await User.updateOne(
      { _id: req.user._id },
      {
        imgCollection: reqFiles,
      }
    );
    res.status(200).send({ message: " The User data is Updated " });
  } catch (error) {
    next(error);
  }
};
exports.friendReq = async (req, res, next) => {
  try {
    const check = await User.find({
      _id: req.params.id,
      friendReq: { $in: [req.user._id] },
    });
    if (check.length > 0) {
      const user = await User.updateOne(
        { _id: req.params.id },
        { $pull: { friendReq: req.user._id, friendReqId: req.user._id } }
      );
      res.status(200).send(user);
      if (!user) throw new createError.NotFound();
    } else {
      const user = await User.updateOne(
        { _id: req.params.id },
        { $addToSet: { friendReq: req.user._id, friendReqId: req.user._id } }
      );
      res.status(200).send(user);
      if (!user) throw new createError.NotFound();
    }
  } catch (e) {
    next(e);
  }
};
exports.accepteFriend = async (req, res, next) => {
  try {
    const check = await User.find({
      _id: req.user._id,
      friendReq: { $in: [req.params.id] },
    });
    if (check.length > 0) {
      const user = await User.updateOne(
        { _id: req.params.id },
        {
          $pull: { friendReq: req.user._id, friendReqId: req.user._id },
          $addToSet: { friend: req.user._id, friendId: req.user._id },
        }
        // { $addToSet: { friend: req.user._id, friendId: req.user._id } }
      );
      const friend = await User.updateOne(
        { _id: req.user._id },
        {
          $pull: { friendReq: req.params.id, friendReqId: req.params.id },
          $addToSet: { friend: req.params.id, friendId: req.params.id },
        }
        // { $addToSet: { friend: req.params.id, friendId: req.params.id } }
      );
      res.status(200).send({ message: "accepte successfuly" });
      if (!user) throw new createError.NotFound();
    } else {
      res.status(200).send(check);
    }
  } catch (error) {
    next(error);
  }
};
exports.refuseFriend = async (req, res, next) => {
  try {
    const check = await User.find({
      _id: req.user._id,
      friendReq: { $in: [req.params.id] },
    });

    if (check.length > 0) {
      const user = await User.updateOne(
        { _id: req.user._id },
        { $pull: { friendReq: req.params.id, friendReqId: req.params.id } }
      );
      res.status(200).send(user);
      if (!user) throw new createError.NotFound();
    } else {
      res.status(200).send(check);
    }
  } catch (error) {
    next(error);
  }
};
exports.removeFriend = async (req, res, next) => {
  try {
    const check = await User.find({
      _id: req.user._id,
      friendId: { $in: [req.params.id] },
    });
    if (check.length > 0) {
      const user = await User.updateOne(
        { _id: req.user._id },
        { $pull: { friend: req.params.id, friendId: req.params.id } }
      );
      const friend = await User.updateOne(
        { _id: req.params.id },
        { $pull: { friend: req.user._id, friendId: req.user._id } }
      );
      res.status(200).send({ message: "friend remove" });
      if (!user) throw new createError.NotFound();
    } else {
      res.status(200).send(check);
    }
  } catch (error) {
    next(error);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const email = req.body.email
    const findEmail = await User.find({email})
    console.log(findEmail.length);
    if(findEmail.length > 0){
       res.status(400).send({res: true})
    }else{
      const reqFiles = [];
      const url = "http://" + req.get("host");
      for (var i = 0; i < req.files.length; i++) {
        reqFiles.push(url + "/static/images/" + req.files[i].filename);
      }
      const letSplit = req.body.location.split(",");
      const lng = parseFloat(letSplit[0]);
      const lat = parseFloat(letSplit[1]);
      const resultat = new Array(lng, lat);
      const denver = { type: "Point", coordinates: resultat };
      const user = new User({
        ...req.body,
        location: denver,
        imgCollection: reqFiles,
        acceptTerms : true
      });
      const token = user.generateAuthToken();
      await user.save();
      const data = user.getPublicFields();
      res
        .status(200)
        .cookie("token", token, {
          expires: new Date(Date.now() + 604800000),
          secure: false, // if we are not using https
          httpOnly: false,
        })
        .send(data);
    }

    
  } catch (e) {
    next(e);
  }
};

exports.loginUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email })
      .populate({
        path: "friendReq",
        select:
          "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
      })
      .populate({
        path: "event",
        select:
          "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
      })
      // .populate({
      //   path: "group",
      //   select:
      //     "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
      // })
      .populate({
        path: "friend",
        select:
          "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
      })
      .populate({
        path: "messagerUsers",
        select:
          "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
      });
    // .select("-password -__v");
    // console.log(user);
    const token = user.generateAuthToken();
    const canLogin = await user.checkPassword(password);
    if (!canLogin) throw new createError.NotFound();
    const data = user.getPublicFields();
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 604800000),
        secure: false, // if we are not using https
        httpOnly: false,
      })
      .send(data);
  } catch (e) {
    next(e);
  }
};

exports.passwordForgot = async (req, res, next) => {
  const email = req.body.email;
  const origin = req.get("origin");
  try {
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user){
      return res.status(200).send({ email: "ok" });
    };
    const token = user.generateAuthToken();
    user.resetToken = {
      token: token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    await user.save();
    await this.sendPasswordResetEmail(user, origin, res);
    res.status(200).send({ succusses: "ok" });
  } catch (error) {
    next(error);
  }
};
exports.sendPasswordResetEmail = async (account, origin,res) => {
  try {
    let message;
    const resetUrl = `${origin}/account/reset-password/${account.resetToken.token}`;
    message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>`;

    let transporter = nodemailer.createTransport({
      host: "smtp.hostinger.fr",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "passwordforgot@remgika.com", // generated ethereal user
        pass: "Africadmc01", // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOptions = {
      from: '"Remgika" <passwordforgot@remgika.com>',
      to: account.email,
      subject: "Reset Password",
      html: `<h4>Reset Password Email</h4>
               ${message}`,
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      res.render("contact", { msg: "Email has been sent" });
    });
  } catch (error) {
    return error;
  }
};
exports.validateResetToken = async(req, res, next) => {
  try {
    const token = req.body.token
    const account = await User.findOne({
      'resetToken.token': token,
      'resetToken.expires': { $gt: Date.now() }
  });

  if (!account) throw 'Invalid token';
  res.status(200).send(true);
  } catch (error) {
    next(error)
  }
}

exports.resetPassword = async(req, res, next) => {
  try {
    const userToken = req.body.token
    const password = req.body.password
    const account = await User.findOne({
      'resetToken.token': userToken,
      'resetToken.expires': { $gt: Date.now() }
  });

  if (!account) throw 'Invalid token';

  // update password and remove reset token
  account.password = password
  account.passwordReset = Date.now();
  account.resetToken = undefined;
  const token = account.generateAuthToken();
  const data = account.getPublicFields();
  await account.save();
  res
      .status(200)
      .send(data);
  } catch (error) {
    next(error)
  }
}
exports.authenticateUser = async (req, res, next) => {
  res.status(200).send(req.user);
};

exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token").status(200).send("Bye bye");
};
