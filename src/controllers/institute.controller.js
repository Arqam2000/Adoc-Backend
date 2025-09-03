import { pool } from "../../dbConfig.js";

const addInstitute = async (req, res) => {
    try {
        const { institute, city_code } = req.body

        if (!institute) {
            return res.status(400).json({
                success: false,
                message: "Institute is required"
            })
        }

        const [result] = await pool.query(`INSERT INTO institute (university_name, city) VALUES (?, ?)`, [institute, city_code])

        console.log(result.insertId)

        res.status(201).json({
            success: true,
            institute: {
                university: result.insertId,
                university_name: institute
            }
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Cannot add institute",
            error
        })
    }
}

const getAllInstitutes = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM Institute`)

        const data = result[0]

        res.status(200).json(
            {
                success: true,
                institutes: data
            }
        )

    } catch (error) {
        return res.status(400).json({
                success: false,
                message: "Cannot fetch institutes",
                error
            })
    }
}

const editInstitute = async (req, res) => {
    try {
        const { institute } = req.body
        const { institute_code } = req.params

        if (!institute) {
            return res.status(400).json({
                success: false,
                message: "Please provide institute name"
            })
        }

        const [result] = await pool.query("UPDATE institute SET institute_name = ? WHERE institute_code = ?", [institute, institute_code])

        if (result.affectedRows == 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot update the institute"
            })
        }

        const [rows] = await pool.query(
            "SELECT * FROM institute WHERE institute_code = ?",
            [institute_code]
        );

        return res.status(200).json({
            success: true,
            message: "Institute updated successfuly",
            data: rows[0]
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the institute",
            error: error.message
        })
    }
}

const deleteInstitute = async (req, res) => {
    try {
        const { institute_code } = req.params

        const result = await pool.query("DELETE FROM institute WHERE university = (?)", [institute_code])

        console.log("result", result)

        res.status(200).json({
            success: true,
            message: "Successfully deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the institute",
            error: error.message
        })
    }


}

export {
    addInstitute,
    getAllInstitutes,
    editInstitute,
    deleteInstitute
}