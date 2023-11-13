const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/getsubcategory/:category", async (req, res) => {
  try {
    const category = req.params.category;

    // Fetch the category_id for the specified category
    const categoryResult = await pool.query(
      "SELECT category_id FROM category_id WHERE name = $1",
      [category]
    );

    const category_id = categoryResult.rows[0]?.category_id;

    if (category_id) {
      // Fetch distinct subcategories based on the obtained category_id
      const result = await pool.query(
        "SELECT DISTINCT name FROM category_id WHERE parent_id = $1",
        [category_id]
      );

      const subcategoriesArray = result.rows.map((item) => item.name);
      res.send(subcategoriesArray);
    } else {
      // Handle the case where the category is not found
      res.status(404).send("Category not found");
    }
  } catch (error) {
    console.error("Error getting subcategories:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
