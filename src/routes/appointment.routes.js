import { Router } from "express";
import { bookAppointment, findAppointmentByDate, findPatientByPhone, getAppointments } from "../controllers/appointment.controller.js";

const router = Router()

router.route("/book").post(bookAppointment)
router.route("/book/:id").get(getAppointments)
router.route("/find-patient").post(findPatientByPhone)
router.route("/search").get(findAppointmentByDate)

export default router