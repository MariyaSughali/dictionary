const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/getData", async (req, res) => {
  const result = await pool.query(
    "SELECT category,subcategory,language_name, data FROM dictionary_table JOIN language ON dictionary_table.language_id =language.language_id "
  );

  res.send(result.rows);
});

module.exports = router;
