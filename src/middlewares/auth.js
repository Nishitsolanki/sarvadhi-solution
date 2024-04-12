const jwt =require("jsonwebtoken");
const profileModel = require('../models/profileModel')



//======================================  Authentication  ===========================================//


// const authentication = function(req, res, next) {
//     try {
//         let token = req.header("Authorization");

//         if (!token || !token.startsWith("Bearer ")) {
//             return res.status(401).send({ status: false, message: "Please provide a valid token in the Bearer format." });
//         }
        
//         let splittoken = token.split(" ");
//         if (splittoken.length !== 2) {
//             return res.status(401).send({ status: false, message: "Invalid token format." });
//         }

//         let newToken;
//         try {
//             newToken = jwt.verify(splittoken[1], process.env.SECRET );
//         } catch (error) {
//             return res.status(401).send({ status: false, message: "Invalid token, please login again!" });
//         }

//         next();
//     } catch (error) {
//         res.status(500).send({ status: false, message: error.message });
//     }
// };

// ////==========================================  Authorization  ===========================================//

// const authorization = async function(req, res, next) {
//     try {
//         let token = req.header("Authorization");
//         if (!token || !token.startsWith("Bearer ")) {
//             return res.status(401).send({ status: false, message: "Please provide a valid token in the Bearer format." });
//         }
        
//         let splittoken = token.split(" ");
//         if (splittoken.length !== 2) {
//             return res.status(401).send({ status: false, message: "Invalid token format." });
//         }

//         let newToken;
//         try {
//             newToken = jwt.verify(splittoken[1], process.env.SECRET );
//         } catch (error) {
//             return res.status(401).send({ status: false, message: "Invalid token, please login again!" });
//         }
        
//         let userId = req.params.userId;

//         if (newToken && newToken._id && newToken._id.toString() !== userId.toString()) {
//             return res.status(401).send({ status: false, message: "Unauthorized access!" });
//         }
        
//         next();
//     } catch (error) {
//         res.status(500).send({ status: false, message: error.message });
//     }
// };

// const adminAuthorization = async function(req, res, next) {
//     try {
//         let token = req.header("Authorization");

//         if (!token || !token.startsWith("Bearer ")) {
//             return res.status(401).send({ status: false, message: "Please provide a valid token in the Bearer format." });
//         }
        
//         let splittoken = token.split(" ");
//         if (splittoken.length !== 2) {
//             return res.status(401).send({ status: false, message: "Invalid token format." });
//         }

//         let decodedToken;
//         try {
//             decodedToken = jwt.verify(splittoken[1], process.env.SECRET );
//         } catch (error) {
//             return res.status(401).send({ status: false, message: "Invalid token, please login again!" });
//         }

//         const user = await profileModel.findOne({ username: decodedToken.username });
//         if (!user) {
//             return res.status(404).send({ status: false, message: "User not found." });
//         }

//         if (user.role !== 'admin') {
//             return res.status(403).send({ status: false, message: "You don't have permission to access this resource." });
//         }

//         next();
//     } catch (error) {
//         res.status(500).send({ status: false, message: error.message });
//     }
// };


const authentication = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        next();
    });
};


const authorization = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).json({ message: "Unauthorized" });
        }
    };
};


module.exports = {authentication, authorization}