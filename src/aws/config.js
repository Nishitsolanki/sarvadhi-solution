const aws= require("aws-sdk")


aws.config.update({
    accessKeyId: "AKIA47CRVKNJ65RGKLNY",         /**use your aws accesskey and secretAccessKey*/
    secretAccessKey: "WTKPSiY4WEDmNzdvZwLUBx+6Zl+vRlLfZFzHVFym",
    region: "ap-south-1"
})

let uploadFile= async (file) =>{
   return new Promise( function(resolve, reject) {
    let s3= new aws.S3({apiVersion: '2006-03-01'}); 

    const uploadParams = {
        ACL: "public-read",
        Bucket: "solankiaara", 
        Key: "Group-30/" + file.originalname,
        Body: file.buffer
    };


    s3.upload( uploadParams, function (err, data ){
        if(err) {
            return reject({"error": err})
        }
        return resolve(data.Location)
    })
   })
}


module.exports.uploadFile = uploadFile
