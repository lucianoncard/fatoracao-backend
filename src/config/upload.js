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
      accessKeyId: 'AKIAYHDG6KWD7BHZ22W3',
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

