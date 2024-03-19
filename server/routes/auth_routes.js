import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import { jwtTokens } from "../utils/jwt-helpers.js";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { Username, Password } = req.body;
    const user = await pool.query(
      'SELECT * FROM "Users" WHERE "Username" = $1',
      [Username]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const validPassword = await bcrypt.compare(Password, user.rows[0].Password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    let tokens = jwtTokens(user.rows[0]);
    res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
    res.json({ user: user.rows[0], ...tokens });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { Username, Email, Password } = req.body;
    const userExists = await pool.query(
      'SELECT * FROM "Users" WHERE "Email" = $1',
      [Email]
    );

    if (userExists.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = await pool.query(
      'INSERT INTO "Users" ("Username", "Email", "Password") VALUES($1, $2, $3) RETURNING *',
      [Username, Email, hashedPassword]
    );

    res.json(newUser.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/refresh_token", async (req, res) => {
  const token = req.body.refreshToken;
  const userId = req.body.userId;

  if (!token)
    return res.status(401).json({ message: "User not authenticated" });

  let payload;
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }

  let user;
  try {
    const result = await pool.query('SELECT * FROM "Users" WHERE "Id" = $1', [
      userId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    user = result.rows[0];
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to retrieve user information" });
  }

  let tokens = jwtTokens(user);
  res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
  // Include user information in the response
  res.json({ user, ...tokens });
});

router.delete("/refresh_token", (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Refresh token deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/change_password", async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    const user = await pool.query('SELECT * FROM "Users" WHERE "Id" = $1', [
      userId,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await pool.query(
      'UPDATE "Users" SET "Password" = $1 WHERE "Id" = $2 RETURNING *',
      [hashedPassword, userId]
    );

    res.json(updatedUser.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
