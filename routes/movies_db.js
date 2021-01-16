const express = require("express");
const router = express.Router();
const Joi = require("joi");

const Movie = require("../models/movie");
const Genre = require("../models/genre");

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");

  // not found any:
  if (!movies) return res.status(404).send("Not Found");

  // send:
  return res.status(200).send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  // not found with the given id:
  if (!movie) return res.status(404).send("Not Found");

  // send:
  return res.status(200).send(movie);
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

  const genre = await Genre.findById(req.body.genreId);
  if (!genre)
    return res.status(404).send("Genre not found with the given ID..");

  // send value:
  let movie = new Movie({
    name: req.body.name,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
  });

  movie = await movie.save();
  return res.status(200).send(movie);
});

router.put("/:id", async (req, res) => {
  // not found:
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  // not found with the given id:
  if (!movie) return res.status(404).send("Not Found");

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

  res.status(200).send(movie);
});

router.delete("/:id", async (req, res) => {
  // not found:
  const movie = Movie.findByIdAndRemove({ _id: req.params.id });

  // not found with the given id:
  if (!movie) return res.status(404).send("Not Found");

  // search && delete:
  return res.send(movie);
});

module.exports = router;
