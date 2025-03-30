const User = require("../models/userModel.js")
const passport = require('passport')

// const registerUser = async(req,res)=>{
//     const { username, password, email, role, contact, address } = req.body;
//     console.log(req.body)
//     try{
//         let registeredUser = await User.register(new User({ username, email, role, contact, address }), password, (err, user) => {
//             if (err) {
//               console.log(err)
//               console.log(req.body)
//               return res.status(400).send(err.message);
//             }
        
//             passport.authenticate('local')(req, res, () => {
//               console.log('User registered and logged in');
//             });
//         });
//         res.status(200).send({success:true,mas:"User Signed Up Successfully ", data: registeredUser});
//     }
//     catch(err){
//         res.status(400).send({success:false,msg:'User does not sign up successfully',error:err.message})
//     }

// }

const registerUser = async (req, res) => {
    const { username, password, email, role, contact, address } = req.body;

    try {
        let registeredUser = await User.register(
            new User({ username, email, role, contact, address }),
            password
        );

        // Authenticate the user after registration
        passport.authenticate('local')(req, res, () => {
            console.log('User registered and logged in');
            res.status(200).send({
                success: true,
                msg: "User Signed Up Successfully",
                data: registeredUser,
            });
        });
    } catch (err) {
        console.error("Error during signup:", err);
        res.status(400).send({
            success: false,
            msg: "User does not sign up successfully",
            error: err.message,
        });
    }
};


const loginUser = async(req,res)=>{
    if (req.isAuthenticated()) { 
        console.log("Logged-in User:", req.user);
        
        res.status(200).send({
            success: true,
            message: "Logged in successfully",
            data: req.user
        });
    } else {
        res.status(401).send({ success: false, message: "Login failed" });
    }
}
const getNgos = async (req, res) => {
    try {
        const ngos = await User.find({ role: "NGO" }).select("_id username");
        res.status(200).send({ success: true, data: ngos });
    } catch (err) {
        res.status(500).send({ success: false, message: "Error fetching NGOs", error: err.message });
    }
};
const logOut = async(req,res)=>{
    req.logout((err) => {
        if (err) {
            return next(err);  // Pass error to next middleware
        }
        console.log("User logged out:", req.user);
        req.session.destroy((err) => {  // Destroy session
            if (err) {
                return next(err);
            }
            res.status(200).send({ success: true, message: "Logged out successfully" });
        });
    });
}

module.exports={
    registerUser,
    loginUser,
    getNgos,
    logOut
}