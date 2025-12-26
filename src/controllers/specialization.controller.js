import { pool } from "../../dbConfig.js";
import fs from "fs";
import { uploadToCloud } from "../utils/cloudinary.js";

const addSpecialization = async (req, res) => {
    try {
        const { specialization } = req.body

        const imagePath = req.file.buffer;
        const mimetype = req.file.mimetype;

        console.log(imagePath)
        // console.log(req.body)

        if (!specialization || !imagePath) {
            return res.status(400).json({
                success: false,
                message: "Specialization is required"
            })
        }

        // const imageBuffer = fs.readFileSync(imagePath);
        const url = await uploadToCloud(imagePath, mimetype)

        if (!url) {
          return res.status(500).json({
                success: false,
                message: "Specialization image upload failed"
            })
        }

        const [result] = await pool.query(`INSERT INTO specialization (specialization_name, picture) VALUES (?, ?)`, [specialization, url])

        console.log(result.insertId)

        // fs.unlinkSync(imagePath);

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

        const newData = data.map(obj => {
            const base64Image = obj.picture?.toString("base64");
            // console.log("base64Image", base64Image)
            return {
                ...obj,
                picture: `data:image/png;base64,${base64Image}`
            }
        })

        res.status(200).json(
            {
                success: true,
                specializations: newData
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
        const imagePath = req.file.buffer;
        const mimetype = req.file.mimetype;

        if (!specialization || !imagePath) {
            return res.status(400).json({
                success: false,
                message: "Please provide specialization name"
            })
        }

        // const imageBuffer = fs.readFileSync(imagePath);
        const url = await uploadToCloud(imagePath, mimetype)

        if (!url) {
          return res.status(500).json({
                success: false,
                message: "Specialization image upload failed"
            })
        }

        const [result] = await pool.query("UPDATE specialization SET specialization_name = ?, picture = ? WHERE specialization_code = ?", [specialization, url, specialization_code])

        if (result.affectedRows == 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot update the specialization"
            })
        }

        // fs.unlinkSync(imagePath);

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