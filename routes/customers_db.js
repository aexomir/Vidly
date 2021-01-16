const express = require("express");
const router = express.Router();
const Joi = require("joi");

const Customer = require("../models/customer");

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");

  // not found any:
  if (!customers) return res.status(404).send("Not Found");

  // send:
  return res.status(200).send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  // not found with the given id:
  if (!customer) return res.status(404).send("Not Found");

  // send:
  return res.status(200).send(customer);
});

router.post("/", async (req, res) => {
  // validationSchema:
  const schema = Joi.object({
    name: Joi.string().required().min(3),
  });

  const { error, value } = schema.validate(req.body);
  // bad input || not found :
  if (error)
    return res
      .status(403)
      .send(`Process Completed with an error: ${error.details[0].message}`);

  // send value:
  let customer = new Customer({
    name: req.body.name,
  });

  customer = await customer.save();
  return res.status(200).send(customer);
});

router.put("/:id", async (req, res) => {
  // not found:
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  // not found with the given id:
  if (!customer) return res.status(404).send("Not Found");

  // bad input:
  // validationSchema:
  const schema = Joi.object({
    name: Joi.string().required().min(3),
  });

  const { error, value } = schema.validate(req.body);
  // bad input || not found :
  if (error)
    return res
      .status(403)
      .send(`Process Completed with an error: ${error.details[0].message}`);

  res.status(200).send(customer);
});

router.delete("/:id", async (req, res) => {
  // not found:
  const customer = Customer.findByIdAndRemove({ _id: req.params.id });

  // not found with the given id:
  if (!customer) return res.status(404).send("Not Found");

  // search && delete:
  return res.send(customer);
});

module.exports = router;
