import { Router } from "express";
import { addReview, getReviewsByDoctor, getReviewsByPatient } from "../controllers/review.controller.js";

const router = Router();

router.route("/add-review").post(addReview)
router.route("/get-reviews-by-patient/:id").get(getReviewsByPatient)
router.route("/get-reviews-by-doctor/:id").get(getReviewsByDoctor)

export default router;