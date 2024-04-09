const aws = require("aws-sdk")

// AWS configuration
aws.config.update({
    accessKeyId: process.env.ACCESSID,         /**use your aws accesskey and secretAccessKey*/
    secretAccessKey: process.env.ACCESSKEY,
    region: "ap-south-1"
})

// Function to upload file to AWS S3
exports.uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        const s3 = new aws.S3({ apiVersion: '2006-03-01' });

        const uploadParams = {
            ACL: "public-read",
            Bucket: "solankiaara", 
            Key: "Group-30/" + file.originalname,
            Body: file.buffer
        };

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.Location);
            }
        });
    });
};

