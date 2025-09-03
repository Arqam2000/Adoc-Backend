import { pool } from "../../dbConfig.js";

const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body
        console.log("body", req.body)
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide complete credentials"
            })
        }

        const [rows] = await pool.query("SELECT Dr_Email FROM doctors where Dr_Email = ?", [email])

        if (rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "email already exists"
            })
        }

        await pool.query("INSERT INTO doctors (Dr_Name, Dr_Email, Dr_Phone, Dr_Password) VALUES (?, ?, ?, ?)", [name, email, phone, password])

        return res.status(201).json({
            success: true,
            message: "Registered successfully",
            data: rows
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while registering the doctor",
            error: error.message
        })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide complete credentials"
        })
    }

    const [rows] = await pool.query("SELECT * FROM doctors WHERE Dr_Email = ?", [email])

    if (rows.length == 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid credentials"
        })
    }

    if (rows[0].Dr_Password != password) {
         return res.status(400).json({
            success: false,
            message: "Incorrect password"
        })
    }

    return res.status(200).json({
        success: true,
        message: "Logged in successfuly",
        user: rows
    })
}

const getDoctorProfile = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM doctors")
    
        return res.status(200).json({
            success: true,
            data: rows
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error
        })
    }
}

export {
    register,
    login,
    getDoctorProfile
}