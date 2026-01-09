import { Router } from "express";
import { addReview, getReviewsByDoctor, getReviewsByPatient, updateReview } from "../controllers/review.controller.js";

const router = Router();

router.route("/add-review").post(addReview)
router.route("/get-reviews-by-patient/:id").get(getReviewsByPatient)
router.route("/get-reviews-by-doctor/:id").get(getReviewsByDoctor)
router.route("/update-review/:id").put(updateReview)
   

export default router;