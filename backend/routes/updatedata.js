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
      `SELECT * FROM dictionary_table WHERE category=$1 AND subcategory=$2 AND language_id=$3`,
      [category, subcategory, language_id]
    );

    if (existingData.rows.length > 0) {
      // Data exists, perform update
      const updateQuery = `UPDATE dictionary_table SET data=$1 WHERE category=$2 AND subcategory=$3 AND language_id=$4`;

      await pool.query(updateQuery, [
        jsonDataString,
        category,
        subcategory,
        language_id,
      ]);

      res.send("Data updated successfully.");
    } else {
      // Data doesn't exist, perform insert
      const insertQuery = `INSERT INTO dictionary_table (category, subcategory, language_id, data, isactive) VALUES ($1, $2, $3, $4,true)`;

      await pool.query(insertQuery, [
        category,
        subcategory,
        language_id,
        jsonDataString,
      ]);

      res.send("Data inserted successfully.");
    }
  } catch (error) {
    console.error("Error updating/inserting data:", error);
    res.status(500).send("Error processing data.");
  }
});

module.exports = router;
