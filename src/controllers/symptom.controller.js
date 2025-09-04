import { pool } from "../../dbConfig.js";
import fs from "fs";

const addSymptom = async (req, res) => {
    try {
        const { symptom } = req.body
        const imagePath = req.file.path;
        console.log("symptom", symptom)
        console.log("req.file", req.file)

        const imageBuffer = fs.readFileSync(imagePath);

        if (!symptom || !imagePath) {
            return res.status(400).json({
                success: false,
                message: "Symptom is required"
            })
        }
        console.log("path", imagePath)
        const [result] = await pool.query(`INSERT INTO symptom (symptoms, spict) VALUES (?, ?)`, [symptom, imageBuffer])

        console.log(result.insertId)
        console.log("result",result)

        fs.unlinkSync(imagePath);

        res.status(201).json({
            success: true,
            symptom: {
                symptom: result.insertId,
                symptoms: symptom
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cannot add symptom",
            error
        })
    }
}

const getAllSymptoms = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM symptom`)

        const data = result[0]

        console.log('data', data)

        const newData = data.map(obj => {
            const base64Image = obj.spict?.toString("base64");
            console.log("base64Image", base64Image)
            return {
                ...obj,
                spict: `data:image/png;base64,${base64Image}`
            }
        })
        console.log("new data", newData)
        res.status(200).json(
            {
                success: true,
                symptoms: newData
            }
        )

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cannot fetch symptoms",
            error
        })
    }
}

const editSymptom = async (req, res) => {
    try {
        const { symptom } = req.body
        const { symptom_code } = req.params
        const imagePath = req.file.path;

        if (!symptom || !imagePath) {
            return res.status(400).json({
                success: false,
                message: "Please provide symptom name"
            })
        }
        const imageBuffer = fs.readFileSync(imagePath);

        const [result] = await pool.query("UPDATE symptom SET symptoms = ?, spict = ? WHERE symptom = ?", [symptom, imageBuffer, symptom_code])

        if (result.affectedRows == 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot update the symptom"
            })
        }

        fs.unlinkSync(imagePath);

        const [rows] = await pool.query(
            "SELECT * FROM symptom WHERE symptom = ?",
            [symptom_code]
        );

        const newData = rows[0]
        
        const base64Image = newData.spict?.toString("base64");

        return res.status(200).json({
            success: true,
            message: "Symptom updated successfuly",
            data: {
                ...newData,
                spict: `data:image/png;base64,${base64Image}`
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the symptom",
            error: error.message
        })
    }
}

const deleteSymptom = async (req, res) => {
    try {
        const { symptom_code } = req.params

        const result = await pool.query("DELETE FROM symptom WHERE symptom = (?)", [symptom_code])

        console.log("result", result)

        res.status(200).json({
            success: true,
            message: "Successfully deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the symptom",
            error: error.message
        })
    }


}

export {
    addSymptom,
    getAllSymptoms,
    editSymptom,
    deleteSymptom
}