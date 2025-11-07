import { pool } from "../../dbConfig.js";

const bookAppointment = async (req, res) => {
  try {
    const { dr, patientName, day, time, phone, fees, hospital_name = "no", vc = "no" } = req.body

    console.log("req.body", req.body);

    console.log("data", { dr, patientName, day, time, phone, fees, hospital_name, vc });

    const datetime = `${day} ${time}:00`;

    console.log("datetime", datetime);

    const [patients] = await pool.query("SELECT * FROM patient WHERE pmobile = ? AND pname = ?", [phone, patientName]);

    if (patients.length === 0) {
      // If patient does not exist, create a new patient record
      const [result] = await pool.query(
        `INSERT INTO patient (pname, pmobile) VALUES (?, ?)`,
        [patientName, phone]
      );
      const patientId = result.insertId;
      console.log("New patient created with ID:", patientId);

      await pool.query(
        `INSERT INTO bappoint (dr, patient, bdate, fees, vc, hospital_name) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE
        bdate = VALUES(bdate),
        fees = VALUES(fees)`,
        [dr, patientId, datetime, fees, vc, hospital_name]
      );

      return res.status(201).json({
        success: true,
        message: "Appointment booked successfuly",
        // id: result.insertId
      })
    }

    const [result] = await pool.query(
      `INSERT INTO bappoint (dr, patient, bdate, fees, vc, hospital_name) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE
        bdate = VALUES(bdate),
        fees = VALUES(fees)`,
      [dr, patients[0].patient, datetime, fees, vc, hospital_name]
    );

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfuly",
      // id: result.insertId
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot book appointment",
      error
    })
  }
}

const findPatientByPhone = async (req, res) => {
  try {
    const { data } = req.body;

    console.log("Searching for patient with phone:", data);

    console.log("req.body", req.body);

    const [rows] = await pool.query(
      `SELECT * FROM patient WHERE pmobile = ?`,
      [data]
    );

    if (rows.length > 0) {
      return res.status(200).json({
        success: true,
        patient: rows[0],
        message: "Patient found"
      }); // Return the first matching patient
    }

    return res.status(404).json({
      success: false,
      message: "No patient found with the provided phone number"
    });
    // No patient found
  } catch (error) {
    throw error; // Propagate the error to the caller
  }
}

const getAppointments = async (req, res) => {
  try {
    const { id } = req.params;
    // const [rows] = await pool.query("SELECT * FROM bappoint WHERE dr = ?", [id]);

    // const [rows] = await pool.query("SELECT b.dr, b.bdate, b.done, b.fees, p.pname, p.pemail, p.pmobile FROM bappoint b JOIN patient p ON p.patient = b.patient WHERE dr = ?", [id]);

    const [rows] = await pool.query("SELECT b.dr, b.bdate, b.done, b.fees, b.vc, p.pname, p.pemail, p.pmobile, b.hospital_name FROM bappoint b JOIN patient p ON p.patient = b.patient WHERE dr = ?", [id]);

    return res.status(200).json({
      success: true,
      appointments: rows
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot fetch appointments",
      error
    });
  }
}

const findAppointmentByDate = async (req, res) => {
  try {
    const {query} = req.query;
    console.log("query", query);

    const [result] = await pool.query("SELECT * FROM `bappoint` WHERE bdate=?", [query]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        appointments: result,
        message: "Appointments found"
      });
    }

    return res.status(404).json({
      success: false,
      message: "No appointments found for the given date"
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot fetch appointments by date",
      error
    });
  }
}
export {
  bookAppointment,
  findPatientByPhone,
  getAppointments,
  findAppointmentByDate
}