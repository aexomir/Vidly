const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const debug = require("debug")("app:startup");

const logger = require("./middlewares/logger");
const genres = require("./routes/genres_db");
const customers = require("./routes/customers_db");
const movies = require("./routes/movies_db");
const rentals = require("./routes/rentals_db");
const users = require("./routes/users_db");
const auth = require("./routes/auth_db");
const home = require("./routes/home");

const app = express();

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("./api/auth", auth);

// Configuration:
// set in config folder
debug(`Application name: ${config.get("name")}`);
debug(`Application Mail: ${config.get("mail.host")}`);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwt is not defined!");
  process.exit(1);
}

const port = process.env.PORT || 27017;
app.listen(port, () => console.log(`Listening on port ${port}`));
