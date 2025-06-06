const mongoose =require("mongoose");
const mailSender =require('../utils/mailSender');
const emailTemplate = require("../mail/templates/emailVerification");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 2*60,
    }
    
});

// a function to send email
async function sendVerificationEmail(email,otp){
    try {
        const mailResponse = await mailSender(email,
			"Verification Email",
			emailTemplate(otp))
        //console.log("Email sent Successfully: ", mailResponse.response);
    } catch (error) {
        console.log("error occured while sending mails: ", error);
        throw error;
    }
}
OTPSchema.pre("save", async function (next){
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", OTPSchema);