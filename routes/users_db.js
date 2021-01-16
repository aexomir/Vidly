const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const Joi = require("joi");

const auth = require("../middlewares/auth");

const User = require("../models/user");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).send(user);
});

router.post("/", async (req, res) => {
  try {
    // validationSchema:
    const schema = Joi.object({
      name: Joi.string().required().min(3),
      email: Joi.string().required().min(3).email(),
      password: Joi.string().required().min(8),
    });

    const { error, value } = schema.validate(req.body);
    // bad input || not found :
    if (error)
      return res
        .status(400)
        .send(`Process Completed with an error: ${error.details[0].message}`);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User Already Exists");

    // send value:
    user = new User(_.pick(req.body, ["name", "email", "password"]));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = User.generateAuthToken();

    return res.header("x-auth-token", token).status(200).send(token);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
