const nodemailer = require('nodemailer');

const mailSender =async(email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }

        })
        let info = await transporter.sendMail({
            from:'NextAcademy || Rajat Saini',
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        //console.log("Message sent: %s", info);
        return info;
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"something went wrong sending email",
            "error":error.message,
        })
    }
}

module.exports = mailSender;