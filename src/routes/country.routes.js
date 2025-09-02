import { Router } from "express";
import { addCountry, deleteCountry, editCountry, getAllCountries } from "../controllers/country.controller.js";

const router = Router()

router.route("/add-country").post(addCountry)
router.route("/get-countries").get(getAllCountries)
router.route("/edit-country/:country_code").patch(editCountry)
router.route("/delete-country/:country_code").delete(deleteCountry)

export default router