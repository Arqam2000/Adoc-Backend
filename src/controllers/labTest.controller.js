import { pool } from "../../dbConfig.js";
import { uploadPDFToCloud } from "../utils/cloudinary.js";

const addLabTest = async (req, res) => {
  try {
    const {patientId, date, doctor, labTestFor} = req.body;

    console.log("req.body", req.body)
    console.log("req.file", req.file)
    console.log("req.file.path", req.file?.path)

    
    if (!patientId || !date || !doctor || !labTestFor) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const buffer = req.file.buffer

    const pdfUrl = await uploadPDFToCloud(buffer);

    if (!pdfUrl) {
      return res.status(500).json({
                success: false,
                message: "Pdf file upload failed"
            })
    }


    const [result] = await pool.query("INSERT INTO lab_test (patient, date, doctor, lab_test_for, lab_report) VALUES (?, ?, ?, ?, ?)", [patientId, date, doctor, labTestFor, pdfUrl]);

    return res.status(201).json({
      success: true,
      message: "Lab test added successfully",
      labTestId: result.insertId
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the lab test",
      error: error.message
    });
  }
}

const getLabTests = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT * FROM lab_test WHERE patient = ?", [id]);

    return res.status(200).json({
      success: true,
      labTests: rows
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the lab tests",
      error
    });
  }
}                 

export { addLabTest, getLabTests };