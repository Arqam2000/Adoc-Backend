import { Router } from "express";
import { addHospital, deleteHospital, editHospital, getAllHospitals } from "../controllers/hospital.controller.js";

const router = Router()

router.route("/add-hospital").post(addHospital)
router.route("/get-hospitals").get(getAllHospitals)
router.route("/edit-hospital/:hospital_code").patch(editHospital)
router.route("/delete-hospital/:hospital_code").delete(deleteHospital)

export default router