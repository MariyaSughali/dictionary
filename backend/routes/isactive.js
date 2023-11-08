const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.put("/isactive/:id", async (req, res) => {
  const { isactive } = req.body;
  const id = req.params.id;
  const result = await pool.query(
    "UPDATE dictionary_table SET isactive=$1 WHERE id =$2",
    [isactive, id]
  );

  res.send(result.rows);
});

module.exports = router;
