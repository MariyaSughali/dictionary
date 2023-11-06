const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/getlanguage", async (req, res) => {
  const result = await pool.query("SELECT language_name FROM language");
  // console.log(result);
  const languageArray = result.rows.map((item) => item.language_name);
  // console.log(languageArray);
  res.send(languageArray);
});

module.exports = router;
