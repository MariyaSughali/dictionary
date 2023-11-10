const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/getcategory", async (req, res) => {
  const result = await pool.query("SELECT DISTINCT category FROM category");
  // console.log(result);
  const categoriesArray = result.rows.map((item) => item.category);
  // console.log(categoriesArray);
  res.send(categoriesArray);
});

module.exports = router;
