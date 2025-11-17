import { Router } from "express";
import { bookAppointment, closeAppointment, findAppointmentByDate, findPatientByPhone, getAppointments, getAppointmentsByPatient, saveAppointmentStatus } from "../controllers/appointment.controller.js";

const router = Router()

router.route("/book").post(bookAppointment)
router.route("/book/:id").get(getAppointments)
router.route("/book/patient/:id").post(getAppointmentsByPatient)
router.route("/find-patient").post(findPatientByPhone)
router.route("/search").get(findAppointmentByDate)
router.route("/close-appointment").post(closeAppointment)
router.route("/save-appointment-status").post(saveAppointmentStatus)

export default router