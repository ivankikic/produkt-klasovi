import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const role = req.headers.role;
  const { startDate, endDate } = req.query;
  let query = `SELECT * FROM "Documents${role ?? ""}"`;
  const params = [];

  if (startDate && endDate) {
    query += ' WHERE "Date"::DATE BETWEEN $1 AND $2';
    params.push(startDate, endDate);
  } else {
    const today = new Date().toISOString().slice(0, 10); // Format as 'YYYY-MM-DD'
    query += ' WHERE "Date"::DATE = $1';
    params.push(today);
  }

  query += ' ORDER BY "Date" ASC, "Id" ASC';

  try {
    const allDocuments = await pool.query(query, params);
    res.json({ documents: allDocuments.rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const role = req.headers.role;
  try {
    const { Title, Date, Type, Value, User_Id } = req.body;
    const newDocument = await pool.query(
      `INSERT INTO "Documents${
        role ?? ""
      }" ("Title", "Date", "Type", "Value", "User_Id") VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [Title, Date, Type, Value, User_Id]
    );

    res.json(newDocument);
  } catch (error) {
    console.error(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const role = req.headers.role;
  try {
    const { id } = req.params;
    const { Title, Date, Type, Value, User_Id } = req.body;

    // Start building the query and parameters dynamically
    let query = `UPDATE "Documents${role ?? ""}" SET`;
    const params = [];
    let setParts = [];
    let paramIndex = 1;

    if (Title !== undefined) {
      setParts.push(` "Title" = $${paramIndex++}`);
      params.push(Title);
    }
    if (Date !== undefined) {
      setParts.push(` "Date" = $${paramIndex++}`);
      params.push(Date);
    }
    if (Type !== undefined) {
      setParts.push(` "Type" = $${paramIndex++}`);
      params.push(Type);
    }
    if (Value !== undefined) {
      setParts.push(` "Value" = $${paramIndex++}`);
      params.push(Value);
    }
    if (User_Id !== undefined) {
      setParts.push(` "User_Id" = $${paramIndex++}`);
      params.push(User_Id);
    }

    // Join all set parts with commas
    query += setParts.join(",");

    // Add the WHERE clause to target the specific document
    query += ` WHERE "Id" = $${paramIndex} RETURNING *`;
    params.push(id);

    // Execute the query
    const updateDocument = await pool.query(query, params);

    if (updateDocument.rows.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(updateDocument.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const role = req.headers.role;
  try {
    const { id } = req.params;
    const deleteDocument = await pool.query(
      `DELETE FROM "Documents${role ?? ""}" WHERE "Id" = $1 RETURNING *`,
      [id]
    );

    if (deleteDocument.rows.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ message: "Document deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/branches", async (req, res) => {
  try {
    const allBranches = await pool.query(
      'SELECT * FROM "Branches" ORDER BY "Id" ASC'
    );
    res.json({ branches: allBranches.rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
