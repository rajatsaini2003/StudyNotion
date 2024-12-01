const {contactUsEmail} = require('../mail/templates/contactFormRes');
const mailSender = require('../utils/mailSender');

exports.contactUs= async (req,res) => {
    try {
        const { firstName, lastName, email, message, phoneNo } = req.body;
        if (!firstName || !email || !message) {
            return res.status(403).send({
            success: false,
            message: "All Fields are required",
            });
        }
        const data = {
            firstName,
            lastName: `${lastName ? lastName : "null"}`,
            email,
            message,
            phoneNo: `${phoneNo ? phoneNo : "null"}`,
          };
          const info = await mailSender(
            process.env.CONTACT_MAIL,
            "Enquery",
            `<html><body>${Object.keys(data).map((key) => {
              return `<p>${key} : ${data[key]}</p>`;
            })}</body></html>`
          );
          if (info) {
            const emailRes = await mailSender(
                email,
                "Your Message Sent Successfully",
                contactUsEmail(email, firstName, lastName, message, phoneNo)
            )
            console.log("email res: ",emailRes);
            if(!emailRes){
                console.error("Failed to send email: " + emailRes.message);
                return res.status(500).json({
                    success: false,
                    message: "Failed to send email to student",
                    error: emailRes.message,
                })
            }
            return res.status(200).send({
              success: true,
              message: "Your message has been sent successfully",
            });
        }
        else {
            return res.status(403).send({
              success: false,
              message: "Something went wrong sending email to admin",
            });
          }
        
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: 'Failed to send email',
            error: error.message
        })
    }
}