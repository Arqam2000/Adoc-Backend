import { Router } from "express";
import { deleteDoctorExp, deleteDoctorExpFromId, deleteDoctorHD, deleteDoctorHDFromId, deleteDoctorProfile, deleteDoctorQual, deleteDoctorVD, editDoctorExp, editDoctorHD, editDoctorProfile, editDoctorQual, editDoctorVD, getAllDoctors, getDoctorProfile, login, logout, register } from "../controllers/doctor.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(verifyJWT, logout)
router.route("/get-doctor/:id").post(getDoctorProfile)
router.route("/get-alldoctors").get(getAllDoctors)
router.route("/edit-doctor").post(verifyJWT, editDoctorProfile)
router.route("/delete-doctor").post(verifyJWT, deleteDoctorProfile)
router.route("/edit-doctorqd").post(verifyJWT, editDoctorQual)
router.route("/delete-doctorqd").post(verifyJWT, deleteDoctorQual)
router.route("/edit-doctorvd").post(verifyJWT, editDoctorVD)
router.route("/delete-doctorvd").post(verifyJWT, deleteDoctorVD)
router.route("/edit-doctorhd").post(verifyJWT, editDoctorHD)
router.route("/delete-doctorhd").post(verifyJWT, deleteDoctorHD)
router.route("/delete-doctorhd/:id").post(verifyJWT, deleteDoctorHDFromId)
router.route("/edit-doctorexp").post(verifyJWT, editDoctorExp)
router.route("/delete-doctorexp").post(verifyJWT, deleteDoctorExp)
router.route("/delete-doctorexp/:id").post(verifyJWT, deleteDoctorExpFromId)

export default router