const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');
const JWT = require('jsonwebtoken');
const mailSender = require("../utils/mailSender");
const  passwordUpdated  = require("../mail/templates/passwordUpdate");
require('dotenv').config();

// send otp
exports.sendOTP = async (req, res) => {
    try {
        // fetch email from user's body
        const { email } = req.body;

        //check if user already exists
        const checkUser = await User.findOne({email});
        // if it does then send response
        if(checkUser){
            return res.status(401).json({
                success: false,
                message: "User already registered"
            })
        }

        // else generate OTP
        let otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        

        let result = await OTP.findOne({otp:otp});

        while (result) {
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = OTP.findOne({otp:otp});
        }
        //console.log(" OTP generated : " + otp);

        const otpPayload = {email:email, otp:otp};

        //create an entry for otp
        const otpBody = await OTP.create(otpPayload);
        //console.log(otpPayload);

        // return response successful
        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "OTP can't be sent. Please try again " 
        })
    }
}

// signup
exports.signUp = async (req, res) => {
   try {

     // data from req body
     const { 
        firstName, 
        lastName,
        email, 
        password, 
        confirmPassword, 
        accountType, 
        contactNumber, 
        otp 
    } = req.body;
    
    //validate 
    if( 
        !firstName || 
        !lastName || 
        !email || 
        !password || 
        !confirmPassword || 
        !otp
        ){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

    //console.log(req.body)
    // 2 password match
    if(password !== confirmPassword){
        return res.status(400).json({
            success: false,
            message: "Passwords do not match"
        });
    }
    // check user exists or not
    const userExists = await User.findOne({email});
    if(userExists){
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }
    //find most recent OTP for user
    const RecentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
    
    // validate OTP
    if(RecentOtp.length === 0){
        return res.status(400).json({
            success: false,
            message: "OTP not found regenerate otp"
        });
    }
    else if( otp !== RecentOtp[0].otp){
        return res.status(400).json({
            success: "false",
            message: "otp does not match"
        })
    }
    //console.log("recent OTP := "+ RecentOtp[0].otp);
    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    //create entry in db
    let approved = accountType === "Instructor" ?  false : true;

    const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth: null,
        about:null,
        contactNumber:null,
    });
    const newUser = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password: hashedPassword,
        accountType,
        approved: approved,
        additionalDetails:profileDetails._id,
        image : `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`
    });
    //return response
    return res.status(200).json({
        success: true,
        message: "User registered successfully",
        newUser
    })
   } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registrered. Please try again",
        })
   }
}


//login
exports.login = async (req, res) => {
    try {
        //get data
        const {email, password}=req.body;

        //validate data
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // user exists or not
        const existingUser = await User.findOne({email}).populate("additionalDetails").exec();
        if (!existingUser) {
            return res.status(400).json({
                success:false,
                message:'Email not registered',
            })
        }

        // compare password and generate JWT and return it
        if (await bcrypt.compare(password, existingUser.password)) {
            const payload = {
                email:email,
                accountType: existingUser.accountType,
                id: existingUser._id
            }
    
            const token = JWT.sign(payload,process.env.JWT_SECRET, {
                expiresIn: "24h"
            } )
    
            existingUser.toObject();
            existingUser.token = token;
            existingUser.password = undefined;
            existingUser.tokenExpiresAt =  new Date(Date.now() +  24 * 60 * 60 * 1000)
            //console.log(existingUser)
            const options = {
                expires: new Date(Date.now() +  24 * 60 * 60 * 1000), // Same as token expiry
                httpOnly: true,
                secure: true, // Enable in production with HTTPS
                sameSite: "Strict",
            };

            return res.cookie("token", token, options).status(200).json({
                success:true,
                message:'Login successfull',
                token, 
                existingUser
            })
        }
        else {
            return res.status(401).json({
                success:false,
                message:'Password is incorrect',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

// change password
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword,confirmnewPassword } = req.body;
        //console.log(oldPassword,newPassword,confirmnewPassword)
		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}
        const isPasswordSame = await bcrypt.compare(
			newPassword,
			userDetails.password
		);
        // console.log(newPassword,oldPassword)
        // console.log("isPasswordSame",isPasswordSame)
		if (isPasswordSame===true) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "Your new Password can't be same as old one!" });
		}

		// Match new password and confirm new password
		// if (newPassword !== confirmNewPassword) {
		// 	// If new password and confirm new password do not match, return a 400 (Bad Request) error
		// 	return res.status(400).json({
		// 		success: false,
		// 		message: "The password and confirm password does not match",
		// 	});
		// }

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
                updatedUserDetails.email,
                "Your Password Has Been Changed",				
				passwordUpdated(updatedUserDetails.email,updatedUserDetails.firstName
				)
			);
			//console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};