// const db = require("./db/connection.js");
const consoleTable = require("console.table");
const prompts = require("inquirer");
const express = require("express");
// const router = express.Router();

// Check departments
router.get("/api/departments", (req, res) => {
    const sql = `SELECT * FROM departments`;

    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      console.log("/n");
      console.table(rows);
      return prompts();
    });
});

// module.exports = router;
