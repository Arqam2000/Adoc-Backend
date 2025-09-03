import { Router } from "express";
import { addSymptom, deleteSymptom, editSymptom, getAllSymptoms } from "../controllers/symptom.controller.js";
import multer from 'multer'
const upload = multer({ dest: 'uploads/' })

const router = Router()

router.route("/add-symptom").post(upload.single('image'), addSymptom)
router.route("/get-symptoms").get(getAllSymptoms)
router.route("/edit-symptom/:symptom_code").patch(editSymptom)
router.route("/delete-symptom/:symptom_code").delete(deleteSymptom)

export default router