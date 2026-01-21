import e from "express";
import { pool } from "../../dbConfig.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import generateOTP from "../utils/generateOTP.js";
import sendOTP from "../utils/twilio.js";
import { sendOTPEmail } from "../utils/nodemailer.js";

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
    const { name, username, email, mobile, password, country, state, city, gender, specialization } = req.body

    console.log("body", req.body)

    if (!name || !username || !email || !mobile || !country.name || !state.name || !city.name || !password || !gender || !specialization) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete credentials"
      })
    }

    const [rows] = await pool.query("SELECT email FROM mdoctor where email = ?", [email])

    // if (rows.length > 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "email already exists"
    //   })
    // }

    const [cityRows] = await pool.query("SELECT city_code FROM city WHERE city_name = ?", [city.name])

    const [specializationRows] = await pool.query("SELECT Specialization_code FROM specialization WHERE Specialization_name = ?", [specialization])

    const [result] = await pool.query("INSERT INTO mdoctor (name, username, email, phone, city, city_code, state, country, password, gender, specialization_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [name, username.toLowerCase(), email, mobile, city.name, cityRows[0].city_code, state.name, country.name, password, gender, specializationRows[0].Specialization_code])

    if (result.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to register doctor"
      })
    }

    const [doctorRows] = await pool.query("SELECT * FROM mdoctor WHERE dr = ?", [result.insertId])

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      doctor: doctorRows[0]
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
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide complete credentials"
    })
  }

  console.log("username", username)

  const [rows] = await pool.query("SELECT * FROM mdoctor WHERE username = ?", [username.toLowerCase()])
  // const [rows] = await pool.query(`SELECT * FROM mdoctor WHERE phone IN (${phone})`)

  console.log("rows", rows)

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
    process.env.JWT_SECRET,
    // {
    //     expiresIn: "1d"
    // }
  )

  console.log("token from login", token)

  const [updatedResult] = await pool.query("UPDATE mdoctor SET isLoggedIn = true WHERE dr = ?", [rows[0].dr])

  // console.log("updatedResult", updatedResult.)

  if (updatedResult.affectedRows == 0) {
    return res.status(500).json({
      success: false,
      message: "Could not update login status"
    })
  }

  const [updatedRows] = await pool.query("SELECT * FROM mdoctor WHERE email = ?", [rows[0].email])

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge: new Date(Date.now() + 24 * 60 * 60 * 1000),
  }

  return res.cookie("token", token, options).status(200).json({
    success: true,
    message: "Logged in successfuly",
    user: updatedRows[0]
  })
}

const logout = async (req, res) => {
  try {
    // const { dr } = req.user;

    // if (!dr) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Unauthorized request"
    //   });
    // }

    const { id } = req.body;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request"
      });
    }

    const [updatedResult] = await pool.query("UPDATE mdoctor SET isLoggedIn = false WHERE dr = ?", [id]);

    if (updatedResult.affectedRows == 0) {
      return res.status(500).json({
        success: false,
        message: "Could not update logout status"
      });
    }

    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging out",
      error: error.message
    });
  }
}

const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("email", email)

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const [rows] = await pool.query("SELECT * FROM mdoctor WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Email not registered"
      });
    }

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    await pool.query("DELETE FROM otps WHERE email = ?", [email]);

    let otpExpiry = new Date(Date.now() + 5 * 60000);

    await pool.query(
      "INSERT INTO otps (email, otp_hash, expires_at) VALUES (?, ?, ?)",
      [email, otpHash, otpExpiry]
    );

    const emailRes = await sendOTPEmail(otp, otpExpiry, email, "OTP");

    return res.json({ success: true, message: "OTP sent", emailRes });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while requesting OTP",
      error: error
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM otps WHERE email = ?",
      [email]
    );

    if (!rows.length || rows[0].expires_at < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const isValid = await bcrypt.compare(otp, rows[0].otp_hash);

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const [users] = await pool.query(
      "SELECT * FROM mdoctor WHERE email = ?",
      [email]
    );

    if (!users.length) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    await pool.query("DELETE FROM otps WHERE email = ?", [email]);

    // const token = jwt.sign({ id: users[0].dr }, process.env.JWT_SECRET, {
    //   expiresIn: "7d"
    // });

    return res.status(200).json({
      success: true,
      message: "OTP verified",
      doctor: users[0]
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying OTP",
      error: error
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, email } = req.body;

    if (!password || !confirmPassword || !email) {
      return res.status(400).json({
        success: false,
        message: "Password, confirm password and email are required"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match"
      });
    }

    const [result] = await pool.query("UPDATE mdoctor SET password = ? WHERE email = ?", [password, email]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    const [rows] = await pool.query("SELECT * FROM mdoctor WHERE email = ?", [email]);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
      doctor: rows[0]
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot reset password",
      error
    });
  }
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
    const { id } = req.params

    console.log("id from params:", id)

    const [result] = await pool.query("SELECT * FROM mdoctor WHERE dr = ?", [id])

    let specialization_code = result[0].specialization_code

    const [rows] = await pool.query("SELECT d.dr, d.name, d.username, d.phone, d.email, d.picture, d.about, d.isLoggedIn, c.city_name, country.country_name, s.Specialization_name, GROUP_CONCAT(DISTINCT CONCAT(e.FromDate, ' - ', e.TillDate) SEPARATOR '; ') AS experiences, GROUP_CONCAT(DISTINCT CONCAT(de.degree_name, ' (', i.university_name, ')') SEPARATOR '; ') AS qualifications FROM mdoctor d JOIN specialization s ON s.Specialization_code = d.specialization_code JOIN city c ON c.city_code = d.city_code LEFT JOIN doctorexp e ON e.dr = d.dr LEFT JOIN doctorqd q ON q.dr = d.dr LEFT JOIN institute i ON i.university = q.university LEFT JOIN degree de ON de.degree_code = q.degree_code LEFT JOIN country ON country.country_code = c.country WHERE d.dr = ? GROUP BY d.dr, d.name, d.email, d.picture, d.about, c.city_name, country.country_name, s.Specialization_name", [id])

    const [doctorvd] = await pool.query("SELECT * FROM doctorvd where dr = ?", [id])

    const [doctorhd] = await pool.query("SELECT doctorhd, dr, h.hospital_name, d.DDesig, timein, timeout, day, fees FROM `doctorhd` JOIN hospital h ON h.hospital_code = doctorhd.hospital_code JOIN designation d ON d.Desig = doctorhd.Desig WHERE dr = ?", [id])

    const [doctorexp] = await pool.query("SELECT * FROM doctorexp where dr = ?", [id])

    // console.log("doctorexp", doctorexp)

    let user = rows[0]

    console.log("rows", rows)

    let imgBuffer = user.picture;
    let base64Image = "data:image/png;base64," + imgBuffer?.toString("base64");

    user.picture = base64Image

    console.log("rows[0]", rows[0])

    const [otherDoctors] = await pool.query("SELECT * FROM `mdoctor` WHERE specialization_code = ? AND dr != ?", [specialization_code, id])

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

const getAllDoctors = async (req, res) => {
  try {
    const { isMostExperienced, isLowestFees, isHighestRated, isAvailableToday } = req.body;

    // const [rows] = await pool.query("SELECT d.dr, d.name, d.email, d.phone, d.picture, d.about, d.pmdc_verification, d.appointment_type, d.`is available for free video consultation`, c.city_name, country.country_name, s.Specialization_name, GROUP_CONCAT(DISTINCT CONCAT(e.FromDate, ' - ', e.TillDate) SEPARATOR '; ') AS experiences, GROUP_CONCAT(DISTINCT CONCAT(de.degree_name, ' (', i.university_name, ')') SEPARATOR '; ') AS qualifications FROM mdoctor d JOIN specialization s ON s.Specialization_code = d.specialization_code JOIN city c ON c.city_code = d.city_code LEFT JOIN doctorexp e ON e.dr = d.dr LEFT JOIN doctorqd q ON q.dr = d.dr LEFT JOIN institute i ON i.university = q.university LEFT JOIN degree de ON de.degree_code = q.degree_code LEFT JOIN country ON country.country_code = c.country GROUP BY d.dr, d.name, d.email, d.picture, d.about, d.pmdc_verification, c.city_name, country.country_name, s.Specialization_name")

    let orderByClause = ""
    const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
    // Example: "Mon", "Tue"


    // priority order (you can change priority)
    if (isAvailableToday) {
      orderByClause = "ORDER BY is_available_today DESC";
    } else if (isMostExperienced) {
      orderByClause = "ORDER BY total_experience DESC";
    } else if (isLowestFees) {
      orderByClause = "ORDER BY min_fees ASC";
    } else if (isHighestRated) {
      orderByClause = "ORDER BY avg_rating DESC";
    }

    const [rows] = await pool.query(`
  SELECT 
    d.dr,
    d.name,
    d.email,
    d.phone,
    d.picture,
    d.about,
    d.pmdc_verification,
    d.appointment_type,
    d.\`is available for free video consultation\`,
    c.city_name,
    country.country_name,
    s.Specialization_name,

    /* EXPERIENCE */
    COALESCE(SUM(TIMESTAMPDIFF(YEAR, e.FromDate, e.TillDate)), 0) AS total_experience,

    /* FEES */
    COALESCE(MIN(hd.fees), 0) AS min_fees,

    /* RATINGS */
    COALESCE(r.rate / NULLIF(r.rew, 0), 0) AS avg_rating,

    CASE 
  WHEN 
    EXISTS (
      SELECT 1 
      FROM doctorhd h 
      WHERE h.dr = d.dr AND h.day = ?
    )
    AND
    EXISTS (
      SELECT 1 
      FROM doctorvd v 
      WHERE v.dr = d.dr AND v.day = ?
    )
    THEN 1 ELSE 0
    END AS is_available_today,

    GROUP_CONCAT(DISTINCT CONCAT(e.FromDate, ' - ', e.TillDate) SEPARATOR '; ') AS experiences,
    GROUP_CONCAT(DISTINCT CONCAT(de.degree_name, ' (', i.university_name, ')') SEPARATOR '; ') AS qualifications

  FROM mdoctor d
  JOIN specialization s ON s.Specialization_code = d.specialization_code
  JOIN city c ON c.city_code = d.city_code
  LEFT JOIN country ON country.country_code = c.country
  LEFT JOIN doctorexp e ON e.dr = d.dr
  LEFT JOIN doctorqd q ON q.dr = d.dr
  LEFT JOIN institute i ON i.university = q.university
  LEFT JOIN degree de ON de.degree_code = q.degree_code
  LEFT JOIN doctorhd hd ON hd.dr = d.dr
  LEFT JOIN (
    SELECT dr, COUNT(review) AS rew, SUM(rating) AS rate
    FROM doctorrd
    GROUP BY dr
  ) r ON r.dr = d.dr

  GROUP BY d.dr
  ${orderByClause}
`, [today, today]);


    console.log("rows", rows)

    const userIds = []

    rows?.forEach(user => {
      let imgBuffer = user.picture;
      let base64Image = "data:image/png;base64," + imgBuffer?.toString("base64");
      user.picture = base64Image
      userIds.push(user.dr)
    })

    // console.log("userIds:", userIds)

    const [doctorexp] = await pool.query("SELECT * FROM doctorexp")

    // const [reviews] = await pool.query("select count(review) as rew,sum(rating) as rate, (rate*0.01)/rew as satisfaction from doctorRD")

    const reviews = []
    const hospitals = []
    const videoTimings = []

    for (const element of userIds) {
      // const [result] = await pool.query("select rew, rate,(rate * .01) / rew as satisfaction from(select count(review) as rew, sum(rating) as rate from doctorRD) t where dr = ?", [element])

      // const [result] = await pool.query("select rew, rate, (rate * .01) / rew as satisfaction from (select dr, count(review) as rew, sum(rating) as rate from doctorRD group by dr) t where dr = ?", [element])

      const [result] = await pool.query("select rew, rate, coalesce(rate / nullif(rew, 0), 0) as avg_rating, coalesce(((rate / nullif(rew, 0)) / 5) * 100, 0) as satisfaction_percentage from (select dr, count(review) as rew, sum(rating) as rate from doctorrd group by dr) t where dr = ?", [element])

      reviews.push({ dr: element, ...result[0] })
      // console.log("result:", result)

      const [doctorvd] = await pool.query("SELECT * FROM doctorvd where dr = ?", [element])

      videoTimings.push({ dr: element, videoDetails: doctorvd })

      const [doctorhd] = await pool.query("SELECT doctorhd, dr, h.hospital_name, d.DDesig, timein, timeout, day, fees FROM `doctorhd` JOIN hospital h ON h.hospital_code = doctorhd.hospital_code JOIN designation d ON d.Desig = doctorhd.Desig WHERE dr = ?", [element])

      hospitals.push({ dr: element, hospitalDetails: doctorhd })

    }

    // console.log("rows:", rows)

    return res.status(200).json({
      success: true,
      data: rows,
      doctorexp,
      reviews,
      hospitals,
      videoTimings
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching doctors",
      error
    })
  }
}

const editDoctorProfile = async (req, res) => {
  try {
    const { dr = null, name, email, phone, username, city_code = null, specialization_code = null, about = null, image = null, canDelete = null } = req.body

    console.log(req.body.canDelete)
    console.log("body", req.body)

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

      const [result] = await pool.query("UPDATE mdoctor SET name = ?, email = ?, phone = ?, username = ?, city_code = ?, specialization_code = ?, picture = ?, about = ? WHERE dr = ?", [name, email, phone, username, city_code, specialization_code, imageBuffer, about, dr])

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

    await pool.query("UPDATE mdoctor SET city_code = NULL,specialization_code = NULL, about = NULL, picture = NULL WHERE dr = ?", [dr])

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
    const { dr } = req.body

    await pool.query("DELETE FROM doctorqd WHERE dr = ?", [dr])

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
          continue;
        }

        await pool.query("INSERT INTO doctorvd (dr, fees, timein, timeout, day) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE timein = VALUES(timein), timeout = VALUES(timeout), fees = VALUES(fees)", [dr, videoFees, element.start, element.end, element.day])

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

const deleteDoctorVD = async (req, res) => {
  try {
    const { dr } = req.body
    await pool.query("DELETE FROM doctorvd WHERE dr = ?", [dr])

    return res.status(200).json({
      success: true,
      message: "Video timings deleted successfuly"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Video timings delete failed",
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
            continue;
          }
          await pool.query("INSERT INTO doctorhd (dr, hospital_code, Desig, fees, timein, timeout, day) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE Desig = VALUES(Desig), fees = VALUES(fees), timein = VALUES(timein), timeout = VALUES(timeout)", [dr, hos.hospital, hos.desig, hos.fees, element.start, element.end, element.day])
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
      message: "Cannot update hospital",
      error
    })
  }
}

const deleteDoctorHD = async (req, res) => {
  try {
    const { dr } = req.body

    await pool.query("DELETE FROM doctorhd WHERE dr = ?", [dr])

    return res.status(200).json({
      success: true,
      message: "Hospital deleted successfuly"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot delete hospital"
    })
  }
}

const deleteDoctorHDFromId = async (req, res) => {
  try {
    const { id } = req.params
    const { hospital_code, Desig } = req.body

    await pool.query("DELETE FROM doctorhd WHERE dr = ? AND hospital_code = ? AND Desig = ?", [id, hospital_code, Desig])

    return res.status(200).json({
      success: true,
      message: "Hospital deleted successfuly"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot delete hospital"
    })
  }
}

const editDoctorExp = async (req, res) => {
  try {
    const { experience, dr } = req.body
    if (experience) {
      for (const exp of experience) {
        await pool.query("INSERT INTO doctorexp (dr, hospital_code, Desig, comments, fromDate, tillDate) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE Desig = VALUES(Desig), comments = VALUES(comments), fromDate = VALUES(fromDate), tillDate = VALUES(tillDate)", [dr, exp.hospital, exp.desig, exp.comments, exp.fromDate, exp.tillDate])
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

const deleteDoctorExp = async (req, res) => {
  try {
    const { dr } = req.body

    await pool.query("DELETE FROM doctorexp WHERE dr = ?", [dr])

    return res.status(200).json({
      success: true,
      message: "Doctor experience deleted successfuly"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Doctor experience delete failed",
      error
    })
  }
}

const deleteDoctorExpFromId = async (req, res) => {
  try {
    const { id } = req.params
    const { hospital_code, Desig } = req.body

    await pool.query("DELETE FROM doctorexp WHERE dr = ? AND hospital_code = ? AND Desig = ?", [id, hospital_code, Desig])

    return res.status(200).json({
      success: true,
      message: "Doctor experience deleted successfuly"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Doctor experience delete failed",
      error
    })
  }
}

const editDoctorWaitingTime = async (req, res) => {
  try {
    const { waitingTime, dr } = req.body

    if (!waitingTime) {
      return res.status(400).json({
        success: false,
        message: "Waiting time is required"
      })
    }

    const [result] = await pool.query("UPDATE mdoctor SET waiting_time = ? WHERE dr = ?", [waitingTime, dr])

    if (result.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong while saving waiting time"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Waiting time saved successfuly"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot save waiting time",
      error
    })
  }
}

const saveAppointmentTypes = async (req, res) => {
  try {
    const { dr, appointmentType, availableForFreeVideoConsultation } = req.body

    await pool.query("UPDATE mdoctor SET appointment_type = ?, `is available for free video consultation` = ? WHERE dr = ?", [appointmentType, availableForFreeVideoConsultation, dr])

    return res.status(200).json({
      success: true,
      message: "Appointment types saved successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot save appointment types",
      error
    })
  }

}

export {
  register,
  login,
  logout,
  requestOTP,
  verifyOTP,
  resetPassword,
  getDoctorProfile,
  getAllDoctors,
  editDoctorProfile,
  deleteDoctorProfile,
  editDoctorQual,
  deleteDoctorQual,
  editDoctorVD,
  deleteDoctorVD,
  editDoctorHD,
  deleteDoctorHD,
  deleteDoctorHDFromId,
  editDoctorExp,
  deleteDoctorExp,
  deleteDoctorExpFromId,
  editDoctorWaitingTime,
  saveAppointmentTypes
}