
const jwt = require("jsonwebtoken")

// middleware to check if req is authenticated
const isLoggedIn = (req,res,next) => {

    const token = req.headers["authorization"]
    
    try {
        var decoded = jwt.verify(token,"5678ABC")
        req.user  = decoded;
        next();
    }
    catch(err) {
        return res.json({success: false, messaage:err.message})
    }
}

const isAdmin = (req,res,next) => {
    if(req.user && req.user.role == 1)
    {
        next();
    }
    else 
    {
        return res.json({success: false, messaage:"You don't have permission to access this route"})
    }
}
module.exports = {isLoggedIn,isAdmin}