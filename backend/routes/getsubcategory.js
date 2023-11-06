const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/getsubcategory/:category", async (req, res) => {
  const category = req.params.category;
  // console.log(category);
  const result = await pool.query(
    "SELECT DISTINCT subcategory FROM dictionary_table WHERE category = $1",
    [category]
  );
  const subcategoriesArray = result.rows.map((item) => item.subcategory);
  res.send(subcategoriesArray);
  // console.log(subcategoriesArray);
});

module.exports = router;
