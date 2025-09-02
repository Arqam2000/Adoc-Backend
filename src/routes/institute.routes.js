import {Router} from "express"
import { addInstitute, deleteInstitute, editInstitute, getAllInstitutes } from "../controllers/institute.controller.js"

const router = Router()

router.route("/add-institute").post(addInstitute)
router.route("/get-institutes").get(getAllInstitutes)
router.route("/edit-institute/:institute_code").patch(editInstitute)
router.route("/delete-institute/:institute_code").delete(deleteInstitute)

export default router