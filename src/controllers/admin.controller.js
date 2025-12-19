import { pool } from "../../dbConfig.js";

const loginAdmin = async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const [admin] = await pool.query("SELECT * FROM admin WHERE email = ?", [email]);

    console.log("admin", admin)

    if (admin.length === 0) {
      return res.status(401).json({ 
        message: "Invalid email",
        success: false 
      });
    }

    if (admin[0].password !== password) {
      return res.status(401).json({ 
        message: "Invalid password" ,
        success: false 
      });
    }

    return res.status(200).json({ 
      message: "Login successful",
      success: true,
      admin: {
        id: admin[0].id,
        email: admin[0].email
      }
    });

  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message, success: false } );
  }
}

export { loginAdmin };