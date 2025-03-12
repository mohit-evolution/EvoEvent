const User = require("../Model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {registerSchema,loginSchema} = require("../Middleware/validation")

exports.register = async (req, res) => {
  try {

    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password,roleId  } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists!" });

    user = new User({ name, email, password,roleId });
    await user.save();

    res.status(201).json({ message: "User registered successfully!",user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.login = async (req, res) => {
  try {
    
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;
   
    let user = await User.findOne({ email }).populate("roleId");
    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful!", user,token });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.getUser = async(req,res)=>{
try {
        const user = await User.find().populate("roleId");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Role" });
    }
}