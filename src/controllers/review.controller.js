import { pool } from "../../dbConfig.js";

const addReview = async (req, res) => {
  try {
    let { patient, dr, overallSatisfaction, waitingTimeMins, consultationTimeMins, recommend, patientSatisfaction, staffBehaviour, clinicEnvironment, remarks, postAnonymously} = req.body;

    if (!patient || !dr || !overallSatisfaction || !waitingTimeMins || !consultationTimeMins || !recommend || !patientSatisfaction) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (overallSatisfaction === "Yes"){
      overallSatisfaction = "Y"
    } 
    else {
      overallSatisfaction = "N"
    }

    if (recommend === "Yes"){
      recommend = "Y"
    } 
    else {
      recommend = "N"
    }

    if (patientSatisfaction === "Yes"){
      patientSatisfaction = 1
    } else {
      patientSatisfaction = 0
    }

    if(staffBehaviour === "Unprofessional"){
      staffBehaviour = 1
    }else if(staffBehaviour === "Needs Improvement"){
      staffBehaviour = 2
    } else if(staffBehaviour === "Average"){
      staffBehaviour = 3
    } else if(staffBehaviour === "Professional"){
      staffBehaviour = 4
    } else if(staffBehaviour === "Excellent"){
      staffBehaviour = 5
    }

    if(clinicEnvironment === "Bad"){
      clinicEnvironment = 1
    } else if(clinicEnvironment === "Poor"){
      clinicEnvironment = 2
    } else if(clinicEnvironment === "Average"){
      clinicEnvironment = 3
    } else if(clinicEnvironment === "Good"){
      clinicEnvironment = 4
    } else if(clinicEnvironment === "Excellent"){
      clinicEnvironment = 5
    }

    if (postAnonymously ){
      postAnonymously = "Y"
    } else {
      postAnonymously = "N"
    }

    const [result] = await pool.query("INSERT INTO review (patient, dr, overall_satisfaction, waiting_time, consultation_time, recommend, patient_satisfaction, staff_behaviour, clinic_environment, remarks, anonymous) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [patient, dr, overallSatisfaction, waitingTimeMins, consultationTimeMins, recommend, patientSatisfaction, staffBehaviour, clinicEnvironment, remarks, postAnonymously]);

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "Failed to add review"
      });
    }

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the review",
      error: error
    });
  }
}

const getReviewsByPatient = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT r.*, d.name as dr_name FROM review r JOIN mdoctor d ON r.dr = d.dr WHERE patient = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews found for the specified patient"
      });
    }

    return res.status(200).json({
      success: true,
      reviews: rows
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the reviews",
      error
    });
  }
}
const getReviewsByDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT * FROM review WHERE dr = ?", [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews found for the specified doctor"
      });
    }

    return res.status(200).json({
      success: true,
      reviews: rows
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the reviews",
      error
    });
  }
}

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { overallSatisfaction, waitingTimeMins, consultationTimeMins, recommend, patientSatisfaction, staffBehaviour, clinicEnvironment, remarks, postAnonymously} = req.body;

    if (overallSatisfaction === "Yes"){
      overallSatisfaction = "Y"
    } 
    else {
      overallSatisfaction = "N"
    }

    if (recommend === "Yes"){
      recommend = "Y"
    } 
    else {
      recommend = "N"
    }

    if (patientSatisfaction === "Yes"){
      patientSatisfaction = 1
    } else {
      patientSatisfaction = 0
    }

    if(staffBehaviour === "Unprofessional"){
      staffBehaviour = 1
    }else if(staffBehaviour === "Needs Improvement"){
      staffBehaviour = 2
    } else if(staffBehaviour === "Average"){
      staffBehaviour = 3
    } else if(staffBehaviour === "Professional"){
      staffBehaviour = 4
    } else if(staffBehaviour === "Excellent"){
      staffBehaviour = 5
    }

    if(clinicEnvironment === "Bad"){
      clinicEnvironment = 1
    } else if(clinicEnvironment === "Poor"){
      clinicEnvironment = 2
    } else if(clinicEnvironment === "Average"){
      clinicEnvironment = 3
    } else if(clinicEnvironment === "Good"){
      clinicEnvironment = 4
    } else if(clinicEnvironment === "Excellent"){
      clinicEnvironment = 5
    }

    if (postAnonymously ){
      postAnonymously = "Y"
    } else {
      postAnonymously = "N"
    }

    const [result] = await pool.query("UPDATE review SET overall_satisfaction = ?, waiting_time = ?, consultation_time = ?, recommend = ?, patient_satisfaction = ?, staff_behaviour = ?, clinic_environment = ?, remarks = ?, anonymous = ? WHERE id = ?", [overallSatisfaction, waitingTimeMins, consultationTimeMins, recommend, patientSatisfaction, staffBehaviour, clinicEnvironment, remarks, postAnonymously, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found or no changes made"
      });
    }
    return res.status(200).json({
      success: true,
      message: "Review updated successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the review",
      error
    });
  }
}

export { 
  addReview, 
  getReviewsByPatient, 
  getReviewsByDoctor,
  updateReview
};