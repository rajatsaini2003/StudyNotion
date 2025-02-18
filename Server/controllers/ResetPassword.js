const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const crypto= require('crypto');

// resetPasswordToken
exports.resetPasswordToken = async (req, res) =>{
    
    try {
        // get email from req body
        const email = req.body.email;
        //check user validation
        const user = await User.findOne({email:email});
        if(!user)return res.status(403).json({
            success: false,
            message: "User not found"
        })

        //generate token
        const token = crypto.randomBytes(20).toString('hex');

        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate( 
                    {email:email},
                    {
                        token:token,
                        resetPasswordExpires:Date.now() + 5*60*1000
                    },
                    {new: true})
        //create url
        const url = `https://localhost:3000/update-password/${token}`;

        //send mail containing url
        await mailSender(email, 
            "password Reset Link",
            `Click here to reset your password: ${url}`
        )

        //return response 
        return res.status(200).json({
            success: true,
            message: "Reset password link sent successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "something went wrong sending reset password link :" +error.message
        })
    }
    
}

//reset password
exports.resetPassword = async(req, res) => {
    try {
        //data fetch
        const {password, confirmPassword, token} = req.body;

        //validation
        if(password != confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            })
        }

        //get userDetails from db using token
        const userDetails = await User.findOne({token: token});
        
        //if no entry - invalid token
        if(!userDetails){
            return res.status(403).json({
                success: false,
                message: "Invalid token"
            })
        }
        
        //token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(403).json({
                success: false,
                message: "Token expired generate new Reset password link"
            })
        }

        //hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        //update new hashed password
        await User.findOneAndUpdate(
            {token: token},// Use token to find the user
            { password: hashedPassword }, // Update password
            { new: true } // Return the updated document
        );
        
        //return success message
        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong resetting password :" + error.message
        })
    }
}