import {Router} from "express"
import { addDegree, deleteDegree, editDegree, getAllDegrees } from "../controllers/degree.controller.js"

const router = Router()

router.route("/add-degree").post(addDegree)
router.route("/get-degrees").get(getAllDegrees)
router.route("/edit-degree/:degree_code").patch(editDegree)
router.route("/delete-degree/:degree_code").delete(deleteDegree)

export default router