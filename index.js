import express from "express";
import { pool } from "./dbConfig.js";

const app = express()

app.use(express.json())


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



app.listen(3000, () => {
    console.log("Server is running at port 3000...")
})