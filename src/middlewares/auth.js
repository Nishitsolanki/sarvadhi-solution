const jwt =require("jsonwebtoken");
const profileModel = require('../models/profileModel')



//======================================  Authentication  ===========================================//

// const ObjectId = require('mongoose').Types.ObjectId;

// const authentication = async function (req, res, next) {
//     try {
//         let authHeader = req.headers["authorization"];
//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.status(401).send({ status: false, message: "Authorization header missing or invalid" });
//         }
//         const token = authHeader.split(" ")[1];
//         if (!token) {
//             return res.status(401).send({ status: false, message: "Token must be provided" });
//         }
//         let decodedToken = jwt.verify(token, "this is secret key", { ignoreExpiration: true });
//         if (!decodedToken) {
//             return res.status(401).send({ status: false, message: "Invalid Token" });
//         }
//         if (Date.now > decodedToken.exp * 1000) {
//             return res.status(401).send({ status: false, message: "Token expired" });
//         }
//         req.decodedToken = decodedToken;
//         next();
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({ status: false, message: error.message });
//     }
// }

// const authorization = async function (req, res, next) {
//     try {
//         let decoded = req.decodedToken;
//         let userIdInToken = decoded.userId;

//         let bookIdInParams = req.params.bookId;
//         if (bookIdInParams) {
//             if (!ObjectId.isValid(bookIdInParams)) {
//                 return res.status(404).send({ status: false, message: "Invalid  id" });
//             }
//             let book = await profileModel.findById(bookIdInParams);
//             if (!book) {
//                 return res.status(404).send({ status: false, message: " Not found" });
//             }
//             let bookUserId = book.userId;
//             if (userIdInToken != bookUserId) {
//                 return res.status(403).send({ status: false, message: "You are not authorized user" });
//             }
//             next();
//         } else {
//             let userIdInBody = req.body.userId;
//             if (userIdInBody) {
//                 if (!ObjectId.isValid(userIdInBody)) {
//                     return res.status(404).send({ status: false, message: "Invalid user id" });
//                 }
//                 if (userIdInBody != userIdInToken) {
//                     return res.status(403).send({ status: false, message: "You are not authorized user" });
//                 }
//             }
//             next();
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({ status: false, message: error.message });
//     }
// }

// module.exports = { authentication, authorization };

const authentication = function(req, res, next) {
    try {
        let token = req.header("Authorization");

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).send({ status: false, message: "Please provide a valid token in the Bearer format." });
        }
        
        let splittoken = token.split(" ");
        if (splittoken.length !== 2) {
            return res.status(401).send({ status: false, message: "Invalid token format." });
        }

        let newToken;
        try {
            newToken = jwt.verify(splittoken[1], process.env.SECRET );
        } catch (error) {
            return res.status(401).send({ status: false, message: "Invalid token, please login again!" });
        }

        next();
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

////==========================================  Authorization  ===========================================//

const authorization = async function(req, res, next) {
    try {
        let token = req.header("Authorization");
        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).send({ status: false, message: "Please provide a valid token in the Bearer format." });
        }
        
        let splittoken = token.split(" ");
        if (splittoken.length !== 2) {
            return res.status(401).send({ status: false, message: "Invalid token format." });
        }

        let newToken;
        try {
            newToken = jwt.verify(splittoken[1], process.env.SECRET );
        } catch (error) {
            return res.status(401).send({ status: false, message: "Invalid token, please login again!" });
        }
        
        let userId = req.params.userId;

        if (newToken && newToken._id && newToken._id.toString() !== userId.toString()) {
            return res.status(401).send({ status: false, message: "Unauthorized access!" });
        }
        
        next();
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

const adminAuthorization = async function(req, res, next) {
    try {
        let token = req.header("Authorization");

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).send({ status: false, message: "Please provide a valid token in the Bearer format." });
        }
        
        let splittoken = token.split(" ");
        if (splittoken.length !== 2) {
            return res.status(401).send({ status: false, message: "Invalid token format." });
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(splittoken[1], process.env.SECRET );
        } catch (error) {
            return res.status(401).send({ status: false, message: "Invalid token, please login again!" });
        }

        const user = await profileModel.findOne({ username: decodedToken.username });
        if (!user) {
            return res.status(404).send({ status: false, message: "User not found." });
        }

        if (user.role !== 'admin') {
            return res.status(403).send({ status: false, message: "You don't have permission to access this resource." });
        }

        next();
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};





module.exports = {authentication, authorization,adminAuthorization}