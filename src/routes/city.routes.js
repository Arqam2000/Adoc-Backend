import { Router } from "express";
import { addCity, deleteCity, editCity, getAllCities } from "../controllers/city.controller.js";

const router = Router()

router.route("/add-city").post(addCity)
router.route("/get-cities").get(getAllCities)
router.route("/edit-city/:city_code").patch(editCity)
router.route("/delete-city/:city_code").delete(deleteCity)

export default router