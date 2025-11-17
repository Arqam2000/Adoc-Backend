import { pool } from "../../dbConfig.js";

const registerPatient = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const [existingPatient] = await pool.query("SELECT * FROM patient WHERE pmobile = ? AND pname = ?", [phone, name]);

    if (existingPatient.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Patient with this phone number already exists"
      });
    }

    const [result] = await pool.query("INSERT INTO patient (pname, pemail, pmobile, ppassword) VALUES (?, ?, ?, ?)", [name, email, phone, password]);

    return res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      patientId: result.insertId
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot register patient",
      error
    });
  }
};

const loginPatient = async (req, res) => {
  // Login logic to be implemented
  try {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }
  
    const [rows] = await pool.query("SELECT * FROM patient WHERE pemail = ? AND ppassword = ?", [email, password]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }
  
    return res.status(200).json({
      success: true,
      message: "Login successful",
      patient: rows[0]
    });   
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot login patient",
      error
    });
  }
}

const getPatientProfile = async (req, res) => {
  // Get patient profile logic to be implemented
  try {
    const [rows] = await pool.query("SELECT * FROM patient WHERE patient = ?", [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient profile fetched successfully",
      patient: rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot get patient profile",
      error
    });
  }
}

export { registerPatient, loginPatient, getPatientProfile };
