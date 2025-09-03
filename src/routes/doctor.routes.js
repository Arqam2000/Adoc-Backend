import { Router } from "express";
import { getDoctorProfile, login, register } from "../controllers/doctor.controller.js";

const router = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/get-doctor").get(getDoctorProfile)

export default router