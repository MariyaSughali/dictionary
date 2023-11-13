const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/getData", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM dictionary JOIN category ON dictionary.category_id=category_id.category_id  "
  );

  res.send(result.rows);
});

module.exports = router;
