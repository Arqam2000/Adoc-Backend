import { Router } from "express";
import { changePassword, editBloodGroup, editEmail, editName, editPhone, getPatientProfile, loginPatient, registerPatient } from "../controllers/patient.controller.js";

const router = Router()

router.route("/register").post(registerPatient)
router.route("/login").post(loginPatient)
router.route("/:id").get(getPatientProfile);
router.route("/edit-name/:id").put(editName);
router.route("/edit-email/:id").put(editEmail);
router.route("/edit-phone/:id").put(editPhone);
router.route("/edit-blood-group/:id").put(editBloodGroup);
router.route("/change-password/:id").put(changePassword);

export default router
