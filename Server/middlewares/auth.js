const JWT = require('jsonwebtoken');
require('dotenv').config();
const User =require('../models/User')

//auth
exports.auth = async (req, res, next) => {
    try {
        //extract token
        const token = req.cookie.token 
            || req.body.token 
             || req.header('Authorization').replace("Bearer ","");

        if(!token){
            return res.status(403).json({
                success: false,
                message:"token not found"
            });
        }
        try {
            const decode =await JWT.verify(token , process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message:"token not valid"
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message:"something went wrong validating token"
        })
    }
}
// isStudent
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'Student'){
            return res.status(401).json({
                success: false,
                message:"this is a protected route for students only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"User not can not be verified"
        })
    }
} 

//isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'Instructor'){
            return res.status(401).json({
                success: false,
                message:"this is a protected route for Instructor only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"User not can not be verified"
        })
    }
} 

//isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'Admin'){
            return res.status(401).json({
                success: false,
                message:"this is a protected route for Admin only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"User not can not be verified"
        })
    }
} 