const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./user.model");


class AuthController {


  signup = async (req, res) => {
    const { email, name ,password } = req.body;

    try {
      if (!email) {
        return res
          .status(400)
          .json({ status_code: 400, error: "Email Number is required." });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
       return res.status(400).json({
            status_code: 400,
            message: "Email already exists. Please login.",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
      
        const newUser = new User({
          email,
          name,
          password: hashedPassword,
          createdAt: Date.now()
        });
        await newUser.save();
   
      res.status(200).json({
        status_code: 200,
        message: "User registered successfully.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  login = async (req, res) => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res
          .status(400)
          .json({ status_code: 400, error: "Email and password are required." });
      } 
      
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ status_code: 400, error: "Email does not exist. Please sign up." });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res
          .status(400)
          .json({ status_code: 400, error: "Incorrect password. Please try again." });
      }
      
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "60d",
      });

      res.status(200).json({
        status_code: 200,
        message: "Login successful.",
        token,
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