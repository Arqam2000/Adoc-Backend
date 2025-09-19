import { Router } from "express";
import { deleteDoctorProfile, editDoctorExp, editDoctorHD, editDoctorProfile, editDoctorQual, editDoctorVD, getDoctorProfile, login, register } from "../controllers/doctor.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/get-doctor").post(verifyJWT, getDoctorProfile)
router.route("/edit-doctor").post(verifyJWT, editDoctorProfile)
router.route("/delete-doctor").post(verifyJWT, deleteDoctorProfile)
router.route("/edit-doctorqd").post(verifyJWT, editDoctorQual)
router.route("/delete-doctorqd").post(verifyJWT, deleteDoctorProfile)
router.route("/edit-doctorvd").post(verifyJWT, editDoctorVD)
router.route("/edit-doctorhd").post(verifyJWT, editDoctorHD)
router.route("/edit-doctorexp").post(verifyJWT, editDoctorExp)

export default router