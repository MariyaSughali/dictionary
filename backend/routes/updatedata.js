const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.put("/updateData", async (req, res) => {
  const { jsonData, category, subcategory, language } = req.body;
  // console.log(jsonData);
  // console.log(category);
  // console.log(subcategory);

  // Stringify the JSON data
  const jsonDataString = JSON.stringify(jsonData);
  const result = await pool.query(
    `SELECT language_id FROM language WHERE language_name=$1`,
    [language]
  );
  const language_id = result.rows[0].language_id;
  // console.log("lang:" + language_id);

  const updateQuery = `UPDATE dictionary_table SET data=$1 WHERE category=$2 AND subcategory=$3 AND language_id=$4`;

  try {
    const result = await pool.query(updateQuery, [
      jsonDataString,
      category,
      subcategory,
      language_id,
    ]);
    // console.log("Data updated:", result.rowCount, "row(s) affected");
    res.send("Data received and processed.");
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).send("Error processing data.");
  }
});

module.exports = router;
