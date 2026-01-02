import { pool } from "../../dbConfig.js";

const addDegree = async (req, res) => {
    try {
        const { degree } = req.body

        if (!degree) {
            return res.status(400).send("Degree is required")
        }

        const [result] = await pool.query(`INSERT INTO degree (degree_name) VALUES (?)`, [degree])

        console.log(result.insertId)

        res.status(201).json({
            success: true,
            degree: {
                degree_code: result.insertId,
                degree_name: degree
            }
        })

    } catch (error) {
        res.send(error.message)
    }
}

const getAllDegrees = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM degree`)

        const data = result[0]

        res.status(200).json(
            {
                success: true,
                degrees: data
            }
        )

    } catch (error) {
        res.send(error.message)
    }
}

const editDegree = async (req, res) => {
    try {
        const { degree } = req.body
        const { degree_code } = req.params

        if (!degree) {
            return res.status(400).json({
                success: false,
                message: "Please provide degree name"
            })
        }

        const [result] = await pool.query("UPDATE degree SET degree_name = ? WHERE degree_code = ?", [degree, degree_code])

        if (result.affectedRows == 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot update the degree"
            })
        }

        const [rows] = await pool.query(
            "SELECT * FROM degree WHERE degree_code = ?",
            [degree_code]
        );

        return res.status(200).json({
            success: true,
            message: "Degree updated successfuly",
            data: rows[0]
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the degree",
            error: error.message
        })
    }
}

const deleteDegree = async (req, res) => {
    try {
        const { degree_code } = req.params

        const result = await pool.query("DELETE FROM degree WHERE degree_code = (?)", [degree_code])

        console.log("result", result)

        res.status(200).json({
            success: true,
            message: "Successfully deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the degree",
            error: error.message
        })
    }


}

export {
    addDegree,
    getAllDegrees,
    editDegree,
    deleteDegree
}