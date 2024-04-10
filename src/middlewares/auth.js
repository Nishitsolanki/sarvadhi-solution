const jwt =require("jsonwebtoken");




//======================================  Authentication  ===========================================//

const authentication = function(req,res,next)
{
    try{
    let token = req.header("Authorization","Bearer Token")

    if(!token)return res.status(401).send({status:false, message:"Please enter token in bearer token"});
    let splittoken=token.split(" ")
    
        jwt.verify(splittoken[1],process.env.SECRET,(error)=>{
            if(error){
            const message = error.message == "jwt expired" ? "Token is expired, please login again!" : "Please recheck your token!"
            return res.status(401).send({status:false, message});
            }
    
            next();
         });
    }
    catch(error){
        res.status(500).send({status:false, message:error.message});

    }
}








//==========================================  Authorization  ===========================================//

const authorization= async function(req,res,next){
    try{
    let token = req.header("Authorization","Bearer Token");
    let splittoken = token.split(" ")
    let newToken = jwt.verify(splittoken[1],process.env.SECRET)
    let userId = req.params.userId

    let decodedToken = newToken._id.toString()
    let realToken = userId.toString()

    if(decodedToken !== realToken)return res.status(401).send({status :false,message: "Unauthorized access!"});
     

    next()
    }
    catch(error){
        res.status(500).send({status:false, message:error.message});

    }
}

const adminAuthorization = async function(req, res, next) {
    try {
        let token = req.header("Authorization");
        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).send({ status: false, message: "Unauthorized access! Token missing or invalid." });
        }
        
        let splittoken = token.split(" ");
        if (splittoken.length !== 2) {
            return res.status(401).send({ status: false, message: "Unauthorized access! Invalid token format." });
        }

        let newToken = jwt.verify(splittoken[1], process.env.SECRET );
        let userId = req.params.userId;

        if (!newToken._id || newToken._id.toString() !== userId.toString()) {
            return res.status(401).send({ status: false, message: "Unauthorized access! User ID mismatch." });
        }

        // Fetch user profile from database
        const userProfile = await Profile.findById(userId);
        if (!userProfile) {
            return res.status(404).send({ status: false, message: "User not found." });
        }

        // Check if user is an admin
        if (userProfile.role !== 'admin') {
            return res.status(403).send({ status: false, message: "Forbidden! User is not an admin." });
        }

        // Optionally, you can attach the decoded token to the request object for later use
        req.user = newToken;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).send({ status: false, message: "Unauthorized access! Invalid token." });
        }
        res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = {authentication, authorization,adminAuthorization}