import { pool } from "../../dbConfig.js";

const addHospital = async (req, res) => {
    try {
        const { hospital, cityCode } = req.body

        if (!hospital) {
            return res.status(400).json({
                success: false,
                message: "Hospital is required"
            })
        }

        const [result] = await pool.query(`INSERT INTO hospital (hospital_name, city_code) VALUES (?, ?)`, [hospital, cityCode])

        console.log(result.insertId)

        res.status(201).json({
            success: true,
            hospital: {
                hospital_code: result.insertId,
                hospital_name: hospital
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cannot add hospital",
            error
        })
    }
}

const getAllHospitals = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM hospital`)

        const data = result[0]

        res.status(200).json(
            {
                success: true,
                hospitals: data
            }
        )

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cannot fetch hospitals",
            error
        })
    }
}

const editHospital = async (req, res) => {
    try {
        const { hospital } = req.body
        const { hospital_code } = req.params

        if (!hospital) {
            return res.status(400).json({
                success: false,
                message: "Please provide hospital name"
            })
        }

        const [result] = await pool.query("UPDATE hospital SET hospital_name = ? WHERE hospital_code = ?", [hospital, hospital_code])

        if (result.affectedRows == 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot update the hospital"
            })
        }

        const [rows] = await pool.query(
            "SELECT * FROM hospital WHERE hospital_code = ?",
            [hospital_code]
        );

        return res.status(200).json({
            success: true,
            message: "Hospital updated successfuly",
            data: rows[0]
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the hospital",
            error: error.message
        })
    }
}

const deleteHospital = async (req, res) => {
    try {
        const { hospital_code } = req.params

        const result = await pool.query("DELETE FROM hospital WHERE hospital_code = (?)", [hospital_code])

        console.log("result", result)

        res.status(200).json({
            success: true,
            message: "Successfully deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the hospital",
            error: error.message
        })
    }


}

export {
    addHospital,
    getAllHospitals,
    editHospital,
    deleteHospital
}