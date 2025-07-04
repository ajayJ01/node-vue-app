const User = require("../models/User");
const { success, error } = require("../utils/response");

exports.getProfile = async (req, reply) => {
  try {
    reply.send({ message: "Profile fetched", user: req.user });
  } catch (err) {
    reply.code(500).send({ message: "Server Error" });
  }
};

exports.getAllNormalUsers = async (req, reply) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    return success(reply, "Users fetched successfully", users);
  } catch (err) {
    console.error("Get Users Error:", err.message);
    return error(reply);
  }
};
