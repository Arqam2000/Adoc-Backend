import mysql from "mysql2/promise"

// console.log("DB ENV CHECK:", {
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   db: process.env.DB_NAME,
// });

export const pool = mysql.createPool({
  host: process.env.DB_HOST, // or your MySQL host
  user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  password: '',
  database: process.env.DB_NAME
});

