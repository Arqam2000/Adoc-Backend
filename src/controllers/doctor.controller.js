import { pool } from "../../dbConfig.js";
import jwt from "jsonwebtoken";

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

    const token = jwt.sign(
        // {
        // dr: rows[0].dr
        rows[0].dr,
        // }, 
        "My Private",
        // {
        //     expiresIn: "1d"
        // }
    )

    console.log("token from login", token)

    const options = {
        httpOnly: true,
        secure: true,

    }

    return res.cookie("token", token, options).status(200).json({
        success: true,
        message: "Logged in successfuly",
        user: rows[0]
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
        let user = req.user
        let specialization_code = user.specialization_code

        // console.log("user:", user)

        // const [rows] = await pool.query("SELECT d.name, d.email, d.picture, d.about, c.city_name, s.Specialization_name, e.FromDate, e.TillDate FROM mdoctor d JOIN specialization s ON s.Specialization_code = d.specialization_code JOIN city c ON c.city_code = d.city_code LEFT JOIN doctorexp e ON e.dr = d.dr WHERE d.dr = 1", [user.dr])
        const [rows] = await pool.query("SELECT d.dr, d.name, d.email, d.picture, d.about, c.city_name, country.country_name, s.Specialization_name, GROUP_CONCAT(DISTINCT CONCAT(e.FromDate, ' - ', e.TillDate) SEPARATOR '; ') AS experiences, GROUP_CONCAT(DISTINCT CONCAT(de.degree_name, ' (', i.university_name, ')') SEPARATOR '; ') AS qualifications FROM mdoctor d JOIN specialization s ON s.Specialization_code = d.specialization_code JOIN city c ON c.city_code = d.city_code LEFT JOIN doctorexp e ON e.dr = d.dr LEFT JOIN doctorqd q ON q.dr = d.dr LEFT JOIN institute i ON i.university = q.university LEFT JOIN degree de ON de.degree_code = q.degree_code RIGHT JOIN country ON country.country_code = c.country WHERE d.dr = ? GROUP BY d.dr, d.name, d.email, d.picture, d.about, c.city_name, country.country_name, s.Specialization_name", [user.dr])

        const [doctorvd] = await pool.query("SELECT * FROM doctorvd where dr = ?", [user.dr])

        const [doctorhd] = await pool.query("SELECT doctorhd, dr, h.hospital_name, d.DDesig, timein, timeout, day, fees FROM `doctorhd` JOIN hospital h ON h.hospital_code = doctorhd.hospital_code JOIN designation d ON d.Desig = doctorhd.Desig WHERE dr = ?", [user.dr])

        const [doctorexp] = await pool.query("SELECT * FROM doctorexp where dr = ?", [user.dr])

        user = rows[0]

        let imgBuffer = user.picture;
        let base64Image = "data:image/png;base64," + imgBuffer.toString("base64");

        user.picture = base64Image

        console.log("rows[0]", rows[0])

        const [otherDoctors] = await pool.query("SELECT * FROM `mdoctor` WHERE specialization_code = ? AND dr != ?", [specialization_code, user.dr])

        return res.status(200).json({
            success: true,
            doctor: user,
            doctorvd,
            doctorhd,
            doctorexp,
            otherDoctors
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
        const { dr = null, city_code = null, specialization_code = null, about = null, image = null, canDelete = null } = req.body

        console.log(req.body.canDelete)

        if (canDelete) {
            await pool.query("UPDATE mdoctor SET city_code = NULL, specialization_code = NULL, picture = NULL, about = NULL WHERE dr = ?", [dr])

            return res.status(200).json({
                success: true,
                message: "Doctor info deleted successfuly"
            })
        } else {
            // Remove prefix "data:image/png;base64,"
            let base64Image = image.split(";base64,").pop();

            console.log("base64Image", base64Image)

            // Convert base64 string to Buffer
            let imageBuffer = Buffer.from(base64Image, "base64");

            console.log("imageBuffer", imageBuffer)

            const [result] = await pool.query("UPDATE mdoctor SET city_code = ?, specialization_code = ?, picture = ?, about = ?WHERE dr = ?", [city_code, specialization_code, imageBuffer, about, dr])

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
        }



        // console.log("results", results[0].affectedRows)

        // if (experience) {
        //     for (const exp of experience) {
        //         await pool.query(
        //             `INSERT INTO doctorexp (dr, hospital_code, Desig, comments, fromDate, tillDate)
        //    VALUES (?, ?, ?, ?, ?, ?)
        //    ON DUPLICATE KEY UPDATE comments = VALUES(comments), Desig = VALUES(Desig), fromDate = VALUES(fromDate), tillDate = VALUES(tillDate)`,
        //             [dr, exp.hospital, exp.desig, exp.comments, exp.fromDate, exp.tillDate]
        //         );
        //     }
        // }



    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while updating doctor info",
            error
        })
    }
}

const deleteDoctorProfile = async (req, res) => {
    try {
        const { dr } = req.body

        console.log(req.body)

        await pool.query("UPDATE mdoctor SET city_code = NULL,specialization_code = NULL, about = NULL WHERE dr = ?", [dr])

        return res.status(200).json({
            success: true,
            message: "Doctor info deleted successfuly"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while deleting doctor info",
            error
        })
    }
}

const editDoctorQual = async (req, res) => {
    try {
        const { qualifications, dr } = req.body
        if (qualifications) {
            const results = [];
            for (const qual of qualifications) {
                const [qdresult] = await pool.query(
                    "INSERT INTO doctorqd (dr, university, degree_code) VALUES (?, ?, ?)",
                    [dr, qual.institute_id, qual.degree_id]
                );
                results.push(qdresult);
            }

            if (!(results.every(res => res.affectedRows === 1))) {
                return res.status(500).json({
                    success: false,
                    message: "Some inserts failed",
                    details: results
                })
            }
        }

        return res.status(200).json({
            success: true,
            message: "Doctor qualifications updated successfuly"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Doctor qualifications update failed",
            error
        })
    }
}

const deleteDoctorQual = async (req, res) => {
    try {
        const { dr, qualifications } = req.body
        if (qualifications) {
            for (const qual of qualifications) {
                await pool.query("DELETE FROM doctorqd WHERE dr = ? AND university = ? AND degree_code = ?", [dr, qual.institute_id, qual.degree_id])
            }
        }

        return res.status(200).json({
            success: true,
            message: "Doctor qualifications deleted successfuly"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Doctor qualifications delete failed",
            error
        })
    }
}

const editDoctorVD = async (req, res) => {
    try {
        const { videoTimings, videoFees, dr } = req.body
        if (videoTimings) {
            for (const element of videoTimings) {

                if (!element.start && !element.end) {
                    break;
                }

                await pool.query("INSERT INTO doctorvd (dr, fees, timein, timeout, day) VALUES (?, ?, ?, ?, ?)", [dr, videoFees, element.start, element.end, element.day])

            }
        }

        return res.status(200).json({
            success: true,
            message: "Video timings updated successfuly"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Video timings update failed",
            error
        })
    }
}

const editDoctorHD = async (req, res) => {
    try {
        const { dr, hospitalTimings } = req.body

        console.log("hos detail", hospitalTimings)

        if (hospitalTimings) {
            for (const hos of hospitalTimings) {

                for (const element of hos.schedule) {
                    console.log("element", element)
                    if (!element.start && !element.end) {
                        break;
                    }
                    await pool.query("INSERT INTO doctorhd (dr, hospital_code, Desig, fees, timein, timeout, day) VALUES (?, ?, ?, ?, ?, ?, ?)", [dr, hos.hospital, hos.desig, hos.fees, element.start, element.end, element.day])
                }
            }

            return res.status(200).json({
                success: true,
                message: "Hospital updated successfuly"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot update hospital"
        })
    }
}

const editDoctorExp = async (req, res) => {
    try {
        const { experience, dr } = req.body
        if (experience) {
            for (const exp of experience) {
                await pool.query("INSERT INTO doctorexp (dr, hospital_code, Desig, comments, fromDate, tillDate) VALUES (?, ?, ?, ?, ?, ?)", [dr, exp.hospital, exp.desig, exp.comments, exp.fromDate, exp.tillDate])
            }
        }

        return res.status(200).json({
            success: true,
            message: "Doctor experience updated successfuly"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Doctor experience update failed",
            error
        })
    }
}

export {
    register,
    login,
    getDoctorProfile,
    editDoctorProfile,
    deleteDoctorProfile,
    editDoctorQual,
    deleteDoctorQual,
    editDoctorVD,
    editDoctorHD,
    editDoctorExp
}