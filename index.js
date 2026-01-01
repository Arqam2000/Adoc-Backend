import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})
import express from "express";
import { pool } from "./dbConfig.js";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express()

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://kaysoftwares.com",
    "https://myadoc.netlify.app"
  ],
  credentials: true,
  // allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(cookieParser())
app.use("/uploads", express.static("uploads"));

// test route

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running successfully...."
  })
})

// Country Routes
import countryRouter from "./src/routes/country.routes.js"

app.use("/api/v1/countries", countryRouter)

// Hospital Routes
import hospitalRouter from "./src/routes/hospital.routes.js"

app.use("/api/v1/hospitals", hospitalRouter)

// Specialization Routes
import specializationRouter from "./src/routes/specialization.routes.js"

app.use("/api/v1/specializations", specializationRouter)

// City Routes
import cityRouter from "./src/routes/city.routes.js"

app.use("/api/v1/cities", cityRouter)

// Doctor Routes
import doctorRouter from "./src/routes/doctor.routes.js"

app.use("/api/v1/doctors", doctorRouter)

// Patient Routes
import patientRouter from "./src/routes/patient.routes.js"

app.use("/api/v1/patients", patientRouter)

// Institute routes

import instituteRouter from "./src/routes/institute.routes.js"

app.use("/api/v1/institutes", instituteRouter)

// Degree Routes

import degreeRouter from "./src/routes/degree.routes.js"

app.use("/api/v1/degrees", degreeRouter)

// designation routes

import designationRouter from "./src/routes/designation.routes.js"

app.use("/api/v1/designations", designationRouter)

// disease routes

import diseaseRouter from "./src/routes/disease.routes.js"

app.use("/api/v1/diseases", diseaseRouter)

// symptom routes

import symptomRouter from "./src/routes/symptom.routes.js"

app.use("/api/v1/symptoms", symptomRouter)

// appointment routes

import appointmentRouter from "./src/routes/appointment.routes.js"

app.use("/api/v1/appointments", appointmentRouter)

// lab test routes

import labTestRouter from "./src/routes/labTest.routes.js"

app.use("/api/v1/labTests", labTestRouter)

// review routes

import reviewRouter from "./src/routes/review.routes.js"

app.use("/api/v1/reviews", reviewRouter)

// admin routes

import adminRouter from "./src/routes/admin.routes.js"

app.use("/api/v1/admin", adminRouter)

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}...`)
})