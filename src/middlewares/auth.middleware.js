import { pool } from "../../dbConfig.js"
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")

        console.log("token from middleware:", token);
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request"
            })
        }

        const decodedToken = jwt.verify(token, "My Private")

        console.log("decoded token", decodedToken)

        const [rows] = await pool.query("SELECT * FROM mdoctor WHERE dr = ?", [decodedToken])

        const user = rows[0]

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Access Token"
            })
        }

        req.user = user;
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid access token",
            error
        })
    }

}