require('dotenv').config();

const express = require('express');
const bodyParser = require ('body-parser');
const cors = require ('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./app/controllers/index')(app);

app.use('/files', express.static(path.resolve(__dirname, 'uploads')));

app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy-Report-Only',
    "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
  );
  next();
});

app.listen(process.env.PORT || 3333);