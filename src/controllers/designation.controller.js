import { pool } from "../../dbConfig.js";

const addDesignation = async (req, res) => {
    try {
        const { designation } = req.body

        if (!designation) {
            return res.status(400).send("Designation is required")
        }

        const [result] = await pool.query(`INSERT INTO designation (DDesig) VALUES (?)`, [designation])

        console.log(result.insertId)

        res.status(201).json({
            success: true,
            designation: {
                Desig: result.insertId,
                DDesig: designation
            }
        })

    } catch (error) {
        res.send(error.message)
    }
}

const getAllDesignations = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM designation`)

        const data = result[0]

        res.status(200).json(
            {
                success: true,
                designations: data
            }
        )

    } catch (error) {
        res.send(error.message)
    }
}

const editDesignation = async (req, res) => {
    try {
        const { designation } = req.body
        const { designation_code } = req.params

        if (!designation) {
            return res.status(400).json({
                success: false,
                message: "Please provide designation name"
            })
        }

        const [result] = await pool.query("UPDATE designation SET DDesig = ? WHERE Desig = ?", [designation, designation_code])

        if (result.affectedRows == 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot update the designation"
            })
        }

        const [rows] = await pool.query(
            "SELECT * FROM designation WHERE Desig = ?",
            [designation_code]
        );

        return res.status(200).json({
            success: true,
            message: "Designation updated successfuly",
            data: rows[0]
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the designation",
            error: error.message
        })
    }
}

const deleteDesignation = async (req, res) => {
    try {
        const { designation_code } = req.params

        const result = await pool.query("DELETE FROM designation WHERE Desig = (?)", [designation_code])

        console.log("result", result)

        res.status(200).json({
            success: true,
            message: "Successfully deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the designation",
            error: error.message
        })
    }


}

export {
    addDesignation,
    getAllDesignations,
    editDesignation,
    deleteDesignation
}