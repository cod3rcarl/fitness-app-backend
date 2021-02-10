const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const config = require("../config/config");

const s3 = new aws.S3({
  accessKeyId: config.ACCESS_KEY,
  secretAccessKey: config.ACCESS_SECRET,
});

module.exports = multer({
  storage: multerS3({
    s3: s3,
    bucket: "fitness-app-bucket",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname);
      console.log(name);
      console.log(ext);
      cb(null, `${name.replace(/\s/g, "")}-${Date.now()}${ext}`);
    },
  }),
});
