import mysql from "mysql2/promise"

// console.log("DB ENV CHECK:", {
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   db: process.env.DB_NAME,
// });

// export const pool = mysql.createPool({
//   host: process.env.DB_HOST, // or your MySQL host
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   // password: '',
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
// });

// export const pool = mysql.createPool(process.env.DATABASE_URL);

let pool;

async function initDB() {
  while (true) {
    try {
      pool = mysql.createPool(
      //   {
      //   host: process.env.DB_HOST,
      //   user: process.env.DB_USER,
      //   password: process.env.DB_PASSWORD,
      //   database: process.env.DB_NAME,
      //   port: 3306,
      //   waitForConnections: true,
      //   connectionLimit: 10,
      // }
      process.env.DATABASE_URL
    );

      // 🔥 Force DNS + TCP check
      await pool.query("SELECT 1");
      console.log("✅ MySQL connected");
      break;
    } catch (err) {
      console.error("❌ MySQL not ready:", err.code);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

await initDB();

export { pool };