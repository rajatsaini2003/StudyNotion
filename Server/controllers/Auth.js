const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');
const JWT = require('jsonwebtoken');
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
            message: "User cannot be registrered. Please try again" + error.message
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
        !contactNumber || 
        !otp
        ){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }


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
    if(RecentOtp.length == 0){
        return res.status(400).json({
            success: false,
            message: "OTP not found"
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
    let approved = "";
	approved === "Instructor" ? (approved = false) : (approved = true);

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
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found, please register first"
            });
        }

        // compare password and generate JWT and return it
        if(await bcrypt.compare(password, user.password)){
            const payload ={
                email :user.email,
                id:user._id,
                accountType:user.accountType
            }
            const token =JWT.sign(payload,process.env.JWT_SECRET, {
                expiresIn: '24h' 
            })
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }

            //create cookie and send response
            res.cookie('token', token, options).status(200).json({
                success:true,
                token,
                user,
                message: "User logged in successfully"
            })
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Invalid password"
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
exports.changePassword = async (req, res) =>{
    //get data from req body
    const {email, oldPassword, newPassword,confirmNewPassword} =req.body;

    //validation
    if(!oldPassword || !newPassword || !confirmNewPassword){
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }
    //user exists or not
    const user = await User.findOne({email: email});
    if(!user){
        return res.status(401).json({
            success: false,
            message: "User not found, please register first"
        });
    }
    if(await bcrypt.compare(oldPassword, user.password)){
        // 2 password match
        if(newPassword!== confirmNewPassword){
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }
        //Hash Password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        //update new hashed password in database
        await User.findOneAndUpdate(
            { email: email }, // Use email to find the user
            { password: hashedPassword }, // Update password
            { new: true } // Return the updated document
        );

        //return success message
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    }
    else{
        return res.status(401).json({
            success: false,
            message: "Old password is incorrect"
        });
    }
 }