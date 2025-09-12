import { pool } from "../../dbConfig.js";

// const register = async (req, res) => {
//     try {
//         const { name, email, phone, password } = req.body
//         console.log("body", req.body)
//         if (!name || !email || !phone || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please provide complete credentials"
//             })
//         }

//         const [rows] = await pool.query("SELECT Dr_Email FROM doctors where Dr_Email = ?", [email])

//         if (rows.length > 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "email already exists"
//             })
//         }

//         await pool.query("INSERT INTO doctors (Dr_Name, Dr_Email, Dr_Phone, Dr_Password) VALUES (?, ?, ?, ?)", [name, email, phone, password])

//         return res.status(201).json({
//             success: true,
//             message: "Registered successfully",
//             data: rows
//         })
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Something went wrong while registering the doctor",
//             error: error.message
//         })
//     }
// }
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

        const [rows] = await pool.query("SELECT email FROM mdoctor where email = ?", [email])

        if (rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "email already exists"
            })
        }

        await pool.query("INSERT INTO mdoctor (name, email, phone, password) VALUES (?, ?, ?, ?)", [name, email, phone, password])

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

// const login = async (req, res) => {
//     const { email, password } = req.body

//     if (!email || !password) {
//         return res.status(400).json({
//             success: false,
//             message: "Please provide complete credentials"
//         })
//     }

//     const [rows] = await pool.query("SELECT * FROM doctors WHERE Dr_Email = ?", [email])

//     if (rows.length == 0) {
//         return res.status(400).json({
//             success: false,
//             message: "Invalid credentials"
//         })
//     }

//     if (rows[0].Dr_Password != password) {
//          return res.status(400).json({
//             success: false,
//             message: "Incorrect password"
//         })
//     }

//     return res.status(200).json({
//         success: true,
//         message: "Logged in successfuly",
//         user: rows
//     })
// }
const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide complete credentials"
        })
    }

    const [rows] = await pool.query("SELECT * FROM mdoctor WHERE email = ?", [email])

    if (rows.length == 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid credentials"
        })
    }

    if (rows[0].password != password) {
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

// const getDoctorProfile = async (req, res) => {
//     try {
//         const [rows] = await pool.query("SELECT * FROM doctors")

//         return res.status(200).json({
//             success: true,
//             data: rows
//         })
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             error
//         })
//     }
// }
const getDoctorProfile = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM mdoctor")

        return res.status(200).json({
            success: true,
            data: rows[0]
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error
        })
    }
}

const editDoctorProfile = async (req, res) => {
    try {
        const {dr, city_code, specialization_code, about, image, qualifications } = req.body

        console.log(req.body)

        const [result] = await pool.query("UPDATE mdoctor SET city_code = ?, specialization_code = ?, picture = ?, about = ?WHERE dr = ?", [city_code, specialization_code, image, about, dr])

        if (result.affectedRows == 0) {
            res.status(400).json({
                success: false,
                message: "Something went wrong while inserting doctor info"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Doctor info updated successfuly"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while updating doctor info",
            error
        })
    }
}

export {
    register,
    login,
    getDoctorProfile,
    editDoctorProfile
}