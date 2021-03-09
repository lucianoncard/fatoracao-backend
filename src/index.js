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

app.listen(process.env.PORT || 3000);