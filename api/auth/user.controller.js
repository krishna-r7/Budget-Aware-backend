const jwt = require("jsonwebtoken");
const User = require("./user.model");


class AuthController {

  generateUniqueCustomerId = async () => {
    let isUnique = false;
    let customerId;

    while (!isUnique) {
      customerId = "C-" + Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit unique ID
      // Generates 6-digit unique ID
      const existingCust = await User.findOne({ custId: customerId });

      if (!existingCust) {
        isUnique = true;
      }
    }

    return customerId;
  }


  signup = async (req, res) => {
    const { mob_no, form_type, fcmtoken } = req.body;

    try {
      // Check if the email is provided
      if (!mob_no) {
        return res
          .status(400)
          .json({ status_code: 400, error: "Mobile Number is required." });
      }

      //   if (!form_type || !["login", "signup"].includes(form_type)) {
      //   return res.status(400).json({
      //     status_code: 400,
      //     error: "form_type is required and must be either 'login' or 'signup'."
      //   });
      // }

      const otp = 112233; // static otp for development
      // const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit numeric OTP
      const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

      // Check if the email already exists
      const existingUser = await User.findOne({ mob_no });

      // if(existingUser && form_type === 'signup'){
      //   return res.status(400).json({ status_code: 400, error: "Mobile Number is already registered." });
      // }

      // if(!existingUser && form_type === 'login'){
      //   return res.status(400).json({ status_code: 400, error: "User not registered." });
      // }

      if (existingUser && existingUser.is_mob_no_verifed) {
        if (existingUser.status == 1) {

          existingUser.otp = otp;
          existingUser.otpExpires = otpExpires;
          if (fcmtoken) {
            existingUser.fcmtoken = fcmtoken;
          }
          await existingUser.save();
          // }
          // notification.sendEmailNotificationForOtp('xyz', '', existingUser.email, otp);
          // const isProfileComplete = customer.first_name && customer.last_name && customer.mob_no && customer.location && customer.address;

          // Send OTP to mobile number
          // await SmsNotification.sendSms({
          //   phone_number: existingUser.mob_no,
          //   otp_value: otp,
          // });


          //  update this to mobiel template
          // notification.sendEmailNotificationForOtp(
          //   "template_07_10_2024_16_10_5",
          //   "Customer",
          //   existingUser.email,
          //   otp
          // );


          return res.status(200).json({
            status_code: 200,
            message: "OTP sent to your mobile number, Please login with otp.",
          });
        } else {
          return res.status(400).json({
            status_code: 400,
            message: "your account is deactivated",
          });
        }
      } else if (existingUser && !existingUser.is_mob_no_verifed) {
        try {
          const updateData = { otp, otpExpires };
          if (fcmtoken) {
            updateData.fcmtoken = fcmtoken;
          }
          await User.updateOne({ mob_no }, updateData);

          //  update this to mobiel template
          // notification.sendEmailNotificationForOtp(
          //   "template_07_10_2024_16_10_5",
          //   "Customer",
          //   existingUser.email,
          //   otp
          // );

          // await SmsNotification.sendSms({
          //   phone_number: existingUser.mob_no,
          //   otp_value: otp,
          // });

          return res.status(200).json({
            status_code: 200,
            message:
              "Mobile number is not verified. Please verify your Mobile Number. OTP sent to your Mobile Number.",
          });
        } catch (err) {
          return res.status(200).json({ error: "Internal server error" });
        }
      } else {
        // Create a new customer entry with OTP
        const newUser = new User({
          mob_no,
          otp,
          otpExpires,
          is_mob_no_verifed: false,
          fcmtoken: fcmtoken || null
        });
        await newUser.save();
      }

      // Send OTP to email
      // notification.sendEmailNotificationForOtp('xyz', '', email, otp);
      // notification.sendEmailNotificationForOtp(
      //   "template_07_10_2024_16_10_5",
      //   "Customer",
      //   email,
      //   otp
      // );

      // await SmsNotification.sendSms({
      //   phone_number: mob_no,
      //   otp_value: otp,
      // });

      res.status(200).json({
        status_code: 200,
        message: "OTP sent to your Mobile Number. Please verify your Mobile Number.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };



};


module.exports = {
  AuthController,
};     