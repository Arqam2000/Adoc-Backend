import {Router} from "express"
import { addDesignation, deleteDesignation, editDesignation, getAllDesignations } from "../controllers/designation.controller.js"

const router = Router()

router.route("/add-designation").post(addDesignation)
router.route("/get-designations").get(getAllDesignations)
router.route("/edit-designation/:designation_code").patch(editDesignation)
router.route("/delete-designation/:designation_code").delete(deleteDesignation)

export default router