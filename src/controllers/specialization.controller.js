import { pool } from "../../dbConfig.js";

const addSpecialization = async (req, res) => {
    try {
        const { specialization } = req.body

        if (!specialization) {
            return res.status(400).json({
                success: false,
                message: "Specialization is required"
            })
        }

        const [result] = await pool.query(`INSERT INTO specialization (specialization_name) VALUES (?)`, [specialization])

        console.log(result.insertId)

        res.status(201).json({
            success: true,
            specialization: {
                Specialization_code: result.insertId,
                Specialization_name: specialization
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cannot add specialization",
            error
        })
    }
}

const getAllSpecializations = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM Specialization`)

        const data = result[0]

        res.status(200).json(
            {
                success: true,
                specializations: data
            }
        )

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cannot fetch specializations",
            error
        })
    }
}

const editSpecialization = async (req, res) => {
    try {
        const { specialization } = req.body
        const { specialization_code } = req.params

        if (!specialization) {
            return res.status(400).json({
                success: false,
                message: "Please provide specialization name"
            })
        }

        const [result] = await pool.query("UPDATE specialization SET specialization_name = ? WHERE specialization_code = ?", [specialization, specialization_code])

        if (result.affectedRows == 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot update the specialization"
            })
        }

        const [rows] = await pool.query(
            "SELECT * FROM specialization WHERE specialization_code = ?",
            [specialization_code]
        );

        return res.status(200).json({
            success: true,
            message: "Specialization updated successfuly",
            data: rows[0]
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the specialization",
            error: error.message
        })
    }
}

const deleteSpecialization = async (req, res) => {
    try {
        const { specialization_code } = req.params

        const result = await pool.query("DELETE FROM specialization WHERE specialization_code = (?)", [specialization_code])

        console.log("result", result)

        res.status(200).json({
            success: true,
            message: "Successfully deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the specialization",
            error: error.message
        })
    }


}

export {
    addSpecialization,
    getAllSpecializations,
    editSpecialization,
    deleteSpecialization
}