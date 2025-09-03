import { pool } from "../../dbConfig.js";
import fs from "fs";


const addDisease = async (req, res) => {
    try {
        const { disease } = req.body
        const imagePath = req.file.path;
        console.log("disease", disease)
        console.log("req.file", req.file)

        const imageBuffer = fs.readFileSync(imagePath);

        if (!disease || !imagePath) {
            return res.status(400).json({
                success: false,
                message: "Disease is required"
            })
        }

        const [result] = await pool.query(`INSERT INTO diseases (diseases, dpict) VALUES (?, ?)`, [disease, imageBuffer])

        console.log(result.insertId)

        fs.unlinkSync(imagePath);

        res.status(201).json({
            success: true,
            disease: {
                disease: result.insertId,
                diseases: disease
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cannot add disease",
            error
        })
    }
}

const getAllDiseases = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM diseases`)

        const data = result[0]

        const newData = data.map(obj => {
            const base64Image = obj.dpict?.toString("base64");
            console.log("base64Image", base64Image)
            return {
                ...obj,
                dpict: `data:image/png;base64,${base64Image}`
            }
        })

        res.status(200).json(
            {
                success: true,
                diseases: newData
            }
        )

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cannot fetch diseases",
            error
        })
    }
}

const editDisease = async (req, res) => {
    try {
        const { disease } = req.body
        const { disease_code } = req.params

        if (!disease) {
            return res.status(400).json({
                success: false,
                message: "Please provide disease name"
            })
        }

        const [result] = await pool.query("UPDATE diseases SET diseases = ? WHERE disease = ?", [disease, disease_code])

        if (result.affectedRows == 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot update the disease"
            })
        }

        const [rows] = await pool.query(
            "SELECT * FROM diseases WHERE disease = ?",
            [disease_code]
        );

        return res.status(200).json({
            success: true,
            message: "Disease updated successfuly",
            data: rows[0]
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the disease",
            error: error.message
        })
    }
}

const deleteDisease = async (req, res) => {
    try {
        const { disease_code } = req.params

        const result = await pool.query("DELETE FROM diseases WHERE disease = (?)", [disease_code])

        console.log("result", result)

        res.status(200).json({
            success: true,
            message: "Successfully deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the disease",
            error: error.message
        })
    }


}

export {
    addDisease,
    getAllDiseases,
    editDisease,
    deleteDisease
}