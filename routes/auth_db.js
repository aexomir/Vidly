const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const Joi = require("joi");

const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    // validationSchema:
    const schema = Joi.object({
      email: Joi.string().required().min(3),
      password: Joi.string().required().min(8),
    });

    const { error, value } = schema.validate(req.body);
    // bad input || not found :
    if (error)
      return res
        .status(400)
        .send(`Process Completed with an error: ${error.details[0].message}`);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("no user found with this email");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).send("Invalid Password");

    const token = User.generateAuthToken();

    return res.status(200).send(token);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
