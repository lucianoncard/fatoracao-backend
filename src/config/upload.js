const multer = require('multer');
const path = require('path');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const storageTypes = {
  local: multer.diskStorage({
    destination: path.resolve(__dirname, '..', 'uploads'),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);      
      cb(null, `${name}-${Date.now()}${ext}`);
    },
  }),
  s3: multerS3({
    s3: new aws.S3({
      accessKeyId: 'AKIAYHDG6KWD5GJVTTAQ',
      secretAccessKey: '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'
    }),
    bucket: 'fatoracao',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);      
      cb(null, `${name}-${Date.now()}${ext}`);
    }
  })
};

module.exports = {
  storage: storageTypes['s3']
};

