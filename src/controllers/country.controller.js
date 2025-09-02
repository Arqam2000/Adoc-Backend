import { pool } from "../../dbConfig.js";

const addCountry = async (req, res) => {
    try {
        const { country } = req.body

        if (!country) {
            return res.status(400).send("Country is required")
        }

        const [result] = await pool.query(`INSERT INTO country (country_name) VALUES (?)`, [country])

        console.log(result.insertId)

        res.status(201).json({
            success: true,
            country: {
                country_code: result.insertId,
                country_name: country
            }
        })

    } catch (error) {
        res.send(error.message)
    }
}

const getAllCountries = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM Country`)

        const data = result[0]

        res.status(200).json(
            {
                success: true,
                countries: data
            }
        )

    } catch (error) {
        res.send(error.message)
    }
}

const editCountry = async (req, res) => {
    try {
        const { country } = req.body
        const { country_code } = req.params

        if (!country) {
            return res.status(400).json({
                success: false,
                message: "Please provide country name"
            })
        }

        const [result] = await pool.query("UPDATE country SET country_name = ? WHERE country_code = ?", [country, country_code])

        if (result.affectedRows == 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot update the country"
            })
        }

        const [rows] = await pool.query(
            "SELECT * FROM country WHERE country_code = ?",
            [country_code]
        );

        return res.status(200).json({
            success: true,
            message: "Country updated successfuly",
            data: rows[0]
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the country",
            error: error.message
        })
    }
}

const deleteCountry = async (req, res) => {
    try {
        const { country_code } = req.params

        const result = await pool.query("DELETE FROM country WHERE country_code = (?)", [country_code])

        console.log("result", result)

        res.status(200).json({
            success: true,
            message: "Successfully deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the country",
            error: error.message
        })
    }


}

export {
    addCountry,
    getAllCountries,
    editCountry,
    deleteCountry
}