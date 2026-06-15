require("dotenv").config();

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const db = new sqlite3.Database("./glittarzz.db", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("SQLite Connected");
  }
});

/*
CREATE PRODUCTS TABLE
*/

db.run(`
CREATE TABLE IF NOT EXISTS products(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
price REAL,
image TEXT,
category TEXT
)
`);

/*
CREATE ORDERS TABLE
*/

db.run(`
CREATE TABLE IF NOT EXISTS orders(
id INTEGER PRIMARY KEY AUTOINCREMENT,
customerName TEXT,
email TEXT,
address TEXT,
phone TEXT,
items TEXT,
totalAmount REAL,
reference TEXT,
date TEXT
)
`);

/*
INSERT TEST PRODUCTS
*/

db.get("SELECT COUNT(*) AS total FROM products", [], (err, row) => {
  if (row.total === 0) {
    db.run(`
INSERT INTO products(name,price,image,category)
VALUES
('Samsung Galaxy S24',850000,'images/phone1.jpg','Phones & Tablets'),
('HP EliteBook',1200000,'images/laptop1.jpg','Computing'),
('Luxury Wristwatch',150000,'images/watch1.jpg','Fashion'),
('LG Smart TV',650000,'images/tv1.jpg','Electronics')
`);
  }
});

/*
PRODUCT API
*/

app.get("/api/products", (req, res) => {
  const category = req.query.category;

  if (category && category !== "All Collections") {
    db.all(
      "SELECT * FROM products WHERE category=?",
      [category],
      (err, rows) => {
        res.json(rows);
      },
    );
  } else {
    db.all("SELECT * FROM products", [], (err, rows) => {
      res.json(rows);
    });
  }
});

/*
ANNOUNCEMENT API
*/

app.get("/api/announcement", (req, res) => {
  res.json({
    announcement: "🎉 Welcome To Glittarzz! Massive Discounts Available Today.",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/views/admin.html");
});

app.get("/checkout", (req, res) => {
  res.sendFile(__dirname + "/views/checkout.html");
});
