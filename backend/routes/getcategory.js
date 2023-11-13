const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/getcategory", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT name FROM category_id WHERE is_parent = true"
    );

    const categoriesArray = result.rows.map((item) => item.name);

    res.send(categoriesArray);
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
