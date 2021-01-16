const express = require("express");
const router = express.Router();
const Joi = require("joi");

const auth = require("../middlewares/auth");

// fakeData:
const genres = [
  {
    id: 1,
    name: "pop",
  },
  {
    id: 2,
    name: "rap",
  },
  {
    id: 3,
    name: "jazz",
  },
];

router.get("/", (req, res) => {
  // not found any:
  if (!genres) return res.status(404).send("Not Found");

  // send:
  return res.status(200).send(genres);
});

router.get("/:id", (req, res) => {
  const genre = genres.find((genre) => genre.id == parseInt(req.params.id));

  // not found with the given id:
  if (!genre) return res.status(404).send("Not Found");

  // send:
  return res.status(200).send(genre);
});

router.post("/", auth, (req, res) => {
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
  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  genres.push(genre);
  return res.status(200).send(genre);
});

router.put("/:id", (req, res) => {
  // not found:
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));

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

  // update:
  genre.name = req.body.name;
  res.status(200).send(genre);
});

router.delete("/:id", (req, res) => {
  // not found:
  const genre = genres.find((genre) => genre.id == parseInt(req.params.id));

  // not found with the given id:
  if (!genre) return res.status(404).send("Not Found");

  // search && delete:
  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  return res.send(genre);
});

module.exports = router;
