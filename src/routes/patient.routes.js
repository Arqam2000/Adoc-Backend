import { Router } from "express";
import { getPatientProfile, loginPatient, registerPatient } from "../controllers/patient.controller.js";

const router = Router()

router.route("/register").post(registerPatient)
router.route("/login").post(loginPatient)
router.route("/:id").get(getPatientProfile);

export default router
