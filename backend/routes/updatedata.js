const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.put("/updateData", async (req, res) => {
  const { jsonData, category, subcategory, language } = req.body;

  // Stringify the JSON data
  const jsonDataString = JSON.stringify(jsonData);

  try {
    const result = await pool.query(
      `SELECT language_id FROM language WHERE language_name=$1`,
      [language]
    );

    const language_id = result.rows[0].language_id;

    const updateQuery = `UPDATE dictionary_table SET data=$1 WHERE category=$2 AND subcategory=$3 AND language_id=$4`;

    const updateResult = await pool.query(updateQuery, [
      jsonDataString,
      category,
      subcategory,
      language_id,
    ]);

    if (updateResult.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Data not found for the given parameters." });
    }
    res.send("Data received and processed.");
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).send("Error processing data.");
  }
});

module.exports = router;
