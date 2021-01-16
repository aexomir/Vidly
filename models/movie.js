const mongoose = require("mongoose");

const genreSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 15,
    maxLength: 255,
  },
});

const movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: genreSchema, required: true },
  numberInStocks: {
    type: Number,
    default: 0,
    min: 0,
    max: 255,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 255,
    required: true,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
