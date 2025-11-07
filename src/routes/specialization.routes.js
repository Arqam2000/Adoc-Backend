import { Router } from "express";
import { addSpecialization, deleteSpecialization, editSpecialization, getAllSpecializations } from "../controllers/specialization.controller.js";
import multer from 'multer'
const upload = multer({ dest: 'uploads/' })

const router = Router()

router.route("/add-specialization").post(upload.single('image'), addSpecialization)
router.route("/get-specializations").get(getAllSpecializations)
router.route("/edit-specialization/:specialization_code").patch(upload.single('image'), editSpecialization)
router.route("/delete-specialization/:specialization_code").delete(deleteSpecialization)

export default router