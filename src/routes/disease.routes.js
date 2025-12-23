import { Router } from "express";
import { addDisease, deleteDisease, editDisease, getAllDiseases } from "../controllers/disease.controller.js";
import upload from "../utils/multer.js";

const router = Router()

router.route("/add-disease").post(upload.single('image'), addDisease)
router.route("/get-diseases").get(getAllDiseases)
router.route("/edit-disease/:disease_code").patch(upload.single('image'), editDisease)
router.route("/delete-disease/:disease_code").delete(deleteDisease)

export default router