const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Vidly", message: "This is a Sample Page" });
});

module.exports = router;
