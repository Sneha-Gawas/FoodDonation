module.exports.isDonor = (req,res,next)=>{
    console.log("isDonar",req.user)
    if(req.isAuthenticated() && req.user.role === "Donor"){
        return next();
    }else{
        res.status(401).send({success:false,msg:"Access Deneid, Donor Only"})
    }
}
   
// module.exports.isNgo = (req,res,next)=>{
//     console.log("isNGO",req.user)
//     if(req.isAuthenticated() && req.user.role === "NGO"){
//         return next();
//     }else{
//         res.status(401).send({success:false,msg:"Access Deneid, NGO Only"})
//     }
// }

module.exports.isNgo = (req, res, next) => {
    console.log("Checking if user is NGO:", req.user); // Debugging user data

    if (!req.isAuthenticated()) {
        console.log("User not authenticated.");
        return res.status(401).send({ success: false, message: "User not authenticated." });
    }

    if (req.user.role !== "NGO") {
        console.log("User role is not NGO:", req.user.role); // Debugging role
        return res.status(403).send({ success: false, message: "Access denied. User is not an NGO." });
    }

    next();
};





