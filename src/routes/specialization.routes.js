import { Router } from "express";
import { addSpecialization, deleteSpecialization, editSpecialization, getAllSpecializations } from "../controllers/specialization.controller.js";

const router = Router()

router.route("/add-specialization").post(addSpecialization)
router.route("/get-specializations").get(getAllSpecializations)
router.route("/edit-specialization/:specialization_code").patch(editSpecialization)
router.route("/delete-specialization/:specialization_code").delete(deleteSpecialization)

export default router