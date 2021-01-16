const express = require("express");
const router = express.Router();
const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");

  // not found any:
  if (!genres) return res.status(404).send("Not Found");

  // send:
  return res.status(200).send(genres);
});

router.get("/:id", (req, res) => {
  const genre = await Genre.findById(req.params.id)

  // not found with the given id:
  if (!genre) return res.status(404).send("Not Found");

  // send:
  return res.status(200).send(genre);
});

router.post("/", async(req, res) => {
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
  let genre = new Genre({
    name: req.body.name,
  });

  genre = await genre.save()
  return res.status(200).send(genre);
});

router.put("/:id", async (req, res) => {
  // not found:
  const genre = await Genre.findByIdAndUpdate(req.params.id,{name: req.body.name},{new: true})

  // not found with the given id:
  if (!genre) return res.status(404).send("Not Found");

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

  res.status(200).send(genre);
});

router.delete("/:id", async (req, res) => {
  // not found:
  const genre = Genre.findByIdAndRemove({_id: req.params.id});

  // not found with the given id:
  if (!genre) return res.status(404).send("Not Found");

  // search && delete:
  return res.send(genre);
});

module.exports = router;
