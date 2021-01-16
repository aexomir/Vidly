const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const debug = require("debug")("app:startup");

const logger = require("./middlewares/logger");
const genres = require("./routes/genres_db");
const customers = require("./routes/customers_db");
const home = require("./routes/home");

const app = express();

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to mongoDB"))
  .catch((err) =>
    console.log(
      "Couldn't connect to mongoDB ; process finished with error: ",
      err.message
    )
  );

app.set("view engine", "pug");
app.set("views", "./views");

// middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
app.use(morgan("common"));
app.use(logger);

// routes:
app.use("/", home);
app.use("/api/genres", genres);
app.use("/api/customers", customers);

// Configuration:
// set in config folder
debug(`Application name: ${config.get("name")}`);
debug(`Application Mail: ${config.get("mail.host")}`);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
