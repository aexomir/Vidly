const express = require("express");
const Joi = require("joi");

const app = express();
app.use(express.json());

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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

app.get("/api/genres", (req, res) => {
  // not found any:
  if (!genres) return res.status(404).send("Not Found");

  // send:
  return res.status(200).send(genres);
});

app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find((genre) => genre.id == parseInt(req.params.id));

  // not found with the given id:
  if (!genre) return res.status(404).send("Not Found");

  // send:
  return res.status(200).send(genre);
});

app.post("/api/genres", (req, res) => {
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

app.put("/api/genres/:id", (req, res) => {
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

app.delete("/api/genres/:id", (req, res) => {
  // not found:
  const genre = genres.find((genre) => genre.id == parseInt(req.params.id));

  // not found with the given id:
  if (!genre) return res.status(404).send("Not Found");

  // search && delete:
  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  return res.send(genre);
});
