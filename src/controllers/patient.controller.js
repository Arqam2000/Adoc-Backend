import { pool } from "../../dbConfig.js";

const registerPatient = async (req, res) => {
  try {
    const { name, username, email, phone, password, gender, bloodGroup } = req.body;

    if (!name || !username || !phone || !gender || !bloodGroup) {
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

    const [result] = await pool.query("INSERT INTO patient (pname, pusername, pemail, pmobile, ppassword, gender, blood_group) VALUES (?, ?, ?, ?, ?, ?, ?)", [name, username.toLowerCase(), email, phone, password, gender, bloodGroup]);

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
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    const [rows] = await pool.query("SELECT * FROM patient WHERE pusername = ? AND ppassword = ?", [username.toLowerCase(), password]);
    
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
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

const editName = async (req, res) => {
  try {
    const { id } = req.params;
    const { pname } = req.body;

    if (!pname) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    const [result] = await pool.query("UPDATE patient SET pname = ? WHERE patient = ?", [pname, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient name updated successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot edit patient name",
      error
    });
  }
}

const editEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { pemail } = req.body;  

    if (!pemail) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const [result] = await pool.query("UPDATE patient SET pemail = ? WHERE patient = ?", [pemail, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient email updated successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot edit patient email",
      error
    });
  }
}

const editPhone = async (req, res) => {
  try {
    const { id } = req.params;
    const { pmobile } = req.body;

    if (!pmobile) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required"
      });
    }

    const [result] = await pool.query("UPDATE patient SET pmobile = ? WHERE patient = ?", [pmobile, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient phone number updated successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot edit patient phone number",
      error
    });
  }
}
const editBloodGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { blood_group } = req.body; 

    if (!blood_group) {
      return res.status(400).json({
        success: false,
        message: "Blood group is required"
      });
    }

    const [result] = await pool.query("UPDATE patient SET blood_group = ? WHERE patient = ?", [blood_group, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient blood group updated successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot edit patient blood group",
      error
    });
  }
}

const changePassword = async (req, res) => {
  // Change password logic to be implemented
  try {
    const { id } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password, new password, and confirm password are required"
      });
    }

    const [rows] = await pool.query("SELECT * FROM patient WHERE patient = ? AND ppassword = ?", [id, oldPassword]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match"
      });
    }

    const [result] = await pool.query("UPDATE patient SET ppassword = ? WHERE patient = ?", [newPassword, id]);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot change password",
      error
    });
  }
}

export { 
  registerPatient, 
  loginPatient, 
  getPatientProfile, 
  editName, 
  editEmail, 
  editPhone, 
  editBloodGroup,
  changePassword
};