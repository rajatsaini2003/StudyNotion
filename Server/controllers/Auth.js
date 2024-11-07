const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');

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
        var OTP =otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            numbers: true,
            specialCharacters: false
        });
        console.log(" OTP generated : " + OTP);
        const result = await OTP.findOne({otp:OTP});

        while (result){
            OTP =otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                numbers: true,
                specialCharacters: false
            });
            result = await OTP.findOne({otp:OTP});
        }

        const otpPayload = {email:email, otp:OTP};

        //create an entry for otp
        const otpBody = await OTP.create(otpPayload);
        console.log(otpPayload);

        // return response successful
        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

// signup



//login


// change password