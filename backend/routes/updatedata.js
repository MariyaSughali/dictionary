const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.put("/updateData", async (req, res) => {
  const { jsonData, category, subcategory, language } = req.body;

  // Stringify the JSON data
  const jsonDataString = JSON.stringify(jsonData);

  try {
    const languageResult = await pool.query(
      `SELECT language_id FROM language WHERE language_name=$1`,
      [language]
    );

    const language_id = languageResult.rows[0].language_id;

    const existingData = await pool.query(
      `SELECT * FROM dictionary 
       JOIN category_id ON dictionary.category_id = category_id.category_id 
       WHERE category_id.name = $1 AND category_id.language_id = $2`,
      [subcategory, language_id]
    );

    if (existingData.rows.length > 0) {
      // Data exists, perform update
      const categoryResult = await pool.query(
        "SELECT category_id FROM category_id WHERE name = $1 AND language_id = $2",
        [subcategory, language_id]
      );

      const category_id = categoryResult.rows[0].category_id;

      const updateQuery = `UPDATE dictionary SET file_data=$1 WHERE category_id=$2`;

      await pool.query(updateQuery, [jsonDataString, category_id]);

      res.send("Data updated successfully.");
    } else {
      // Data doesn't exist, perform insert

      await pool.query(
        "INSERT INTO category_id (is_parent,isactve,name,language_id,parent_id VALUES (false,"
      );
      const insertQuery = `INSERT INTO dictionary (category_id, file_data, is_active) 
                           VALUES ($1, $2, true)`;

      const categoryResult = await pool.query(
        "SELECT category_id FROM category_id WHERE name = $1 AND language_id = $2",
        [subcategory, language_id]
      );

      const category_id = categoryResult.rows[0].category_id;

      await pool.query(insertQuery, [category_id, jsonDataString]);

      res.send("Data inserted successfully.");
    }
  } catch (error) {
    console.error("Error updating/inserting data:", error);
    res.status(500).send("Error processing data.");
  }
});

module.exports = router;
