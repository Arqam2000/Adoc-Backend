import { Router } from "express";
import { deleteDoctorExp, deleteDoctorExpFromId, deleteDoctorHD, deleteDoctorHDFromId, deleteDoctorProfile, deleteDoctorQual, deleteDoctorVD, editDoctorExp, editDoctorHD, editDoctorProfile, editDoctorQual, editDoctorVD, editDoctorWaitingTime, getAllDoctors, getDoctorProfile, login, logout, register, saveAppointmentTypes } from "../controllers/doctor.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(logout)
// router.route("/logout").post(logout)
router.route("/get-doctor/:id").post(getDoctorProfile)
router.route("/get-alldoctors").get(getAllDoctors)
router.route("/edit-doctor").post( editDoctorProfile)
router.route("/edit-doctorwt").post( editDoctorWaitingTime)
router.route("/delete-doctor").post( deleteDoctorProfile)
router.route("/edit-doctorqd").post( editDoctorQual)
router.route("/delete-doctorqd").post( deleteDoctorQual)
router.route("/edit-doctorvd").post( editDoctorVD)
router.route("/delete-doctorvd").post( deleteDoctorVD)
router.route("/edit-doctorhd").post( editDoctorHD)
router.route("/delete-doctorhd").post( deleteDoctorHD)
router.route("/delete-doctorhd/:id").post( deleteDoctorHDFromId)
router.route("/edit-doctorexp").post( editDoctorExp)
router.route("/delete-doctorexp").post( deleteDoctorExp)
router.route("/delete-doctorexp/:id").post( deleteDoctorExpFromId)
router.route("/appointment-type").post( saveAppointmentTypes)

export default router