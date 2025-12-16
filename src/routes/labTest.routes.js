import { Router } from "express";
import { addLabTest, getLabTests } from "../controllers/labTest.controller.js";
import upload from "../utils/multer.js";

const router = Router()

// Define lab test routes here

router.route("/").post(upload.single('file'), addLabTest)
router.route("/:id").get(getLabTests)

export default router;    