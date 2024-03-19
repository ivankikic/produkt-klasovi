import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const allUsers = await pool.query('SELECT * FROM "Users"');
    res.json({ users: allUsers.rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/current", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.Id;
    const user = await pool.query('SELECT * FROM "Users" WHERE "Id" = $1', [
      userId,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude sensitive information like password before sending the user data
    const { Password, ...userData } = user.rows[0];
    res.json({ userData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
