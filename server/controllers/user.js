const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { AuthenticationError } = require("../errors");
const jwt = require("jsonwebtoken");

const multer = require("multer");
const {
  ContentAndApprovalsListInstance,
} = require("twilio/lib/rest/content/v1/contentAndApprovals");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("profilePicture");

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select({ password: 0 });
  res.json(users);
};

const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select({ password: 0 });
  res.json(user);
};

const confirmation = async (req, res) => {
  console.log(req.params);
  try {
    const { userId } = await jwt.verify(
      req.params.token,
      process.env.JWT_SECRET
    );
    console.log(userId);
    // console.log(req.params.token);

    await User.updateOne({ _id: userId }, { isVerified: true });
    res.redirect("http://localhost:3000");
  } catch (err) {
    res.send("Error confirming email");
  }
};

const disableUser = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the isActive value and save the user
    user.isActive = isActive;
    await user.updateOne({ isActive });

    // Return the updated user
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const { products } = req.body;
  const { id } = req.params;
  if (products) {
    products.map(async (p) => {
      await User.findByIdAndUpdate(p._id);
    });
    res.status(StatusCodes.OK).json({ msg: "success" });
  } else {
    upload(req, res, async (err) => {
      if (err) {
        res.sendStatus(500);
      } else {
        const data = {
          ...req.body,
          profilePicture: "",
          paymentInfo: {
            number: req.body.paymentNumber,
            pdt: req.body.paymentPdt,
          },
        };

        if (req?.file?.filename) data.profilePicture = req.file.filename;
        const product = await User.findByIdAndUpdate(id, data, {
          new: true,
          runValidators: true,
        });
        res.status(StatusCodes.OK).json(product);
      }
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the isActive value and save the user

    await user.deleteOne({ user });

    // Return the updated user
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  disableUser,
  confirmation,
  deleteUser,
};
