import nodemailer from "nodemailer";

export async function sendOTPEmail( otp, otpExpiry, email, emailType) {
  console.log("sendOTPEmail called with:", email, emailType, otpExpiry);
  try {

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "admin@lamaesthetic.co.uk",
        pass: "Lamaesthetic123@",
      },
    });

    const mailOptions = {
      from: 'admin@lamaesthetic.co.uk', // sender address
      to: `${email}`, // list of receivers
      subject: 'Your One-Time Password (OTP) for Verification', // Subject line
      html: `<p style="font-size: 16px;">Hello,

            Your One-Time Password (OTP) is: </br> <span style="font-weight: bold;">${otp}</span></br> This OTP is valid for the ${otpExpiry} minutes.
            Please do not share this code with anyone for security reasons.

            If you did not request this OTP, please ignore this email or contact our support team immediately.

            Thank you, </p>`, // html body
    };

    const mailResponse = await transporter.sendMail(mailOptions);

    // console.log("Mail sent successfully:", mailResponse);

    return mailResponse;

  } catch (error) {
    console.log("Mail error:", error)
    // throw new Error(error.message)
  }
}