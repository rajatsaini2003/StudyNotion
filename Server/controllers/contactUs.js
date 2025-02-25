const {contactUsEmail} = require('../mail/templates/contactFormRes');
const mailSender = require('../utils/mailSender');

exports.contactUs = async (req, res) => {
  try {
      const { firstname, lastname, email, message, phoneNo,countrycode } = req.body;
      
      if (!firstname || !email || !message) {
          return res.status(403).send({
              success: false,
              message: "All Fields are required",
          });
      }

      const data = {
        "First Name": firstname,
        "Last Name": lastname ? lastname : "N/A",
        "Email": email,
        "Phone": phoneNo ? `${countrycode} ${phoneNo}` : "N/A",
        "Message": message,
    };
    
    // Structured HTML Email for Admin
    const emailContent = `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #444;">New Contact Inquiry</h2>
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">Field</th>
                        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">Details</th>
                    </tr>
                    ${Object.entries(data).map(([key, value]) => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;"><strong>${key}</strong></td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${value}</td>
                        </tr>
                    `).join('')}
                </table>
            </body>
        </html>
    `;
    

      // Send enquiry email to admin
      const info = await mailSender(process.env.CONTACT_MAIL, "New Enquiry Received", emailContent);

      if (info) {
          // Confirmation email to user
          const emailRes = await mailSender(
              email,
              "Your Message Sent Successfully",
              contactUsEmail(email, firstname, lastname, message, phoneNo,countrycode)
          );

          if (!emailRes) {
              console.error("Failed to send confirmation email: " + emailRes.message);
              return res.status(500).json({
                  success: false,
                  message: "Failed to send confirmation email",
                  error: emailRes.message,
              });
          }

          return res.status(200).send({
              success: true,
              message: "Your message has been sent successfully",
          });
      } else {
          return res.status(403).send({
              success: false,
              message: "Something went wrong sending email to admin",
          });
      }
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: "Failed to send email",
          error: error.message,
      });
  }
};
