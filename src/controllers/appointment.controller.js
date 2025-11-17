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

    const [rows] = await pool.query("SELECT bappoint, b.dr, b.bdate, b.status, b.fees, b.vc, p.pname, p.pemail, p.pmobile, b.hospital_name FROM bappoint b JOIN patient p ON p.patient = b.patient WHERE dr = ?", [id]);
    // const [rows] = await pool.query("SELECT bappoint, b.dr, b.bdate, b.status, b.fees, b.vc, p.pname, p.pemail, p.pmobile, b.hospital_name FROM bappoint b JOIN patient p ON p.patient = b.patient WHERE b.patient = ?", [id]);

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
const getAppointmentsByPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;
    console.log(id)
    console.log(req.body)
    console.log(date.split("T")[0])
    // const [rows] = await pool.query("SELECT * FROM bappoint WHERE dr = ?", [id]);

    // const [rows] = await pool.query("SELECT b.dr, b.bdate, b.done, b.fees, p.pname, p.pemail, p.pmobile FROM bappoint b JOIN patient p ON p.patient = b.patient WHERE dr = ?", [id]);


    const [rows] = await pool.query("SELECT bappoint, b.dr, d.name, appst.status as dr_status, b.bdate, b.status, b.fees, b.vc, p.pname, p.pemail, p.pmobile, b.hospital_name FROM bappoint b JOIN patient p ON p.patient = b.patient JOIN mdoctor d ON d.dr = b.dr LEFT JOIN appointments_statuses appst ON appst.dr = b.dr  WHERE b.patient = ? AND DATE(b.bdate) = ? AND b.vc = 'yes'", [id, date.split("T")[0]]);

    console.log("rows", rows)

    let count = []

    if (rows.length > 0) {
      const [countRes] = await pool.query("SELECT COUNT(*) AS patients_waiting FROM bappoint WHERE dr = ? AND DATE(bdate) = ? AND vc = 'yes' AND patient != ? AND status = 'pending'", [rows[0]?.dr, date.split("T")[0], id])

      count.push(...countRes)
    }
    
    console.log("count", count)


    // const [result] = await pool.query("SELECT bappoint, b.dr, d.name, b.bdate, b.status, b.fees, b.vc, p.pname, p.pemail, p.pmobile, b.hospital_name FROM bappoint b JOIN patient p ON p.patient = b.patient JOIN mdoctor d ON d.dr = b.dr WHERE b.dr = ? AND DATE(b.bdate) = ? AND b.vc = 'yes' AND b.patient != ?", [rows[0].dr, date.split("T")[0], id]);

    const [appt] = await pool.query("SELECT bappoint, b.dr, d.name, b.bdate, b.status, b.fees, b.vc, p.pname, p.pemail, p.pmobile, b.hospital_name FROM bappoint b JOIN patient p ON p.patient = b.patient JOIN mdoctor d ON d.dr = b.dr WHERE b.patient = ? AND DATE(b.bdate) != ?", [id, date.split("T")[0]]);

    console.log("Appt", appt)

    return res.status(200).json({
      success: true,
      // allAppointments: appt,
      appointments: [...rows, ...appt],
      // appointmentsByDoctor: result,
      patients_waiting: count[0]?.patients_waiting
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
    const { query } = req.query;
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

const closeAppointment = async (req, res) => {
  try {
    const { dr, date, status } = req.body;

    console.log(req.body)

    const formattedDate = new Date(date).toLocaleString("en-CA", {
      hour12: false,
    }).replace(",", "");

    console.log("formattedDate", formattedDate);


    const [appt] = await pool.query("SELECT * FROM appointments_statuses WHERE dr = ? AND date = ?", [dr, formattedDate]);

    if (appt.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Appointment already closed"
      });
    }

    const [result] = await pool.query("INSERT INTO appointments_statuses (dr, date, status) VALUES (?, ?, ?)", [dr, formattedDate, status,]);

    return res.status(200).json({
      success: true,
      message: "Appointment closed successfully"
    });

  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot close appointment",
      error
    });
  }
}

const saveAppointmentStatus = async (req, res) => {
  try {
    const { dr, appointments } = req.body;

    console.log("req.body", req.body)

    let result = [];

    for (const appt of appointments) {
      // const [rows] = await pool.query("SELECT pname from patient WHERE pname = ? AND pmobile = ?", [appt.patient, appt.phone]);

      // console.log("rows[0]", rows[0])

      // result.push(rows[0]);

      const [rows] = await pool.query("UPDATE bappoint SET status = ? WHERE bappoint = ?", [appt.status, appt.bappoint]);

      console.log("rows", rows)
      console.log("rows[0]", rows[0])

      result.push(rows);
    }

    console.log("result", result)


    // for (const appt of appointments) {

    // }

    return res.status(200).json({
      success: true,
      message: "Appointment statuses saved successfully",
      result
    });


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot save appointment status",
      error
    });
  }
}
export {
  bookAppointment,
  findPatientByPhone,
  getAppointments,
  findAppointmentByDate,
  closeAppointment,
  saveAppointmentStatus,
  getAppointmentsByPatient
}