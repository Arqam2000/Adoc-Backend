import { Router } from "express";
import { bookAppointment, closeAppointment, editAppointment, findAppointmentByDate, findPatientByPhone, getAppointment, getAppointments, getAppointmentsByPatient, saveAppointmentStatus } from "../controllers/appointment.controller.js";

const router = Router()

router.route("/book").post(bookAppointment)
router.route("/book/:id").get(getAppointments)
router.route("/book/patient/:id").post(getAppointmentsByPatient)
router.route("/find-patient").post(findPatientByPhone)
router.route("/search").post(findAppointmentByDate)
router.route("/close-appointment").post(closeAppointment)
router.route("/save-appointment-status").post(saveAppointmentStatus)
router.route("/edit-appointment").post(editAppointment)
router.route("/get-appointment").post(getAppointment)

export default router