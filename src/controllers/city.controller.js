import { pool } from "../../dbConfig.js";

const addCity = async (req, res) => {
    try {
        const { city } = req.body

        if (!city) {
            return res.status(400).send("City is required")
        }

        const [result] = await pool.query(`INSERT INTO city (city_name) VALUES (?)`, [city])

        console.log(result.insertId)

        res.status(201).json({
            success: true,
            city: {
                city_code: result.insertId,
                city_name: city
            }
        })

    } catch (error) {
        res.send(error.message)
    }
}

const getAllCities = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM City`)

        const data = result[0]

        res.status(200).json(
            {
                success: true,
                cities: data
            }
        )

    } catch (error) {
        res.send(error.message)
    }
}

const editCity = async (req, res) => {
    try {
        const { city } = req.body
        const { city_code } = req.params

        if (!city) {
            return res.status(400).json({
                success: false,
                message: "Please provide city name"
            })
        }

        const [result] = await pool.query("UPDATE city SET city_name = ? WHERE city_code = ?", [city, city_code])

        if (result.affectedRows == 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot update the city"
            })
        }

        const [rows] = await pool.query(
            "SELECT * FROM city WHERE city_code = ?",
            [city_code]
        );

        return res.status(200).json({
            success: true,
            message: "City updated successfuly",
            data: rows[0]
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the city",
            error: error.message
        })
    }
}

const deleteCity = async (req, res) => {
    try {
        const { city_code } = req.params

        const result = await pool.query("DELETE FROM city WHERE city_code = (?)", [city_code])

        console.log("result", result)

        res.status(200).json({
            success: true,
            message: "Successfully deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the city",
            error: error.message
        })
    }


}

export {
    addCity,
    getAllCities,
    editCity,
    deleteCity
}