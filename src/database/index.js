const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://lucianoncard:lucianoncard@cluster0.ukh0h.mongodb.net/fatoracao?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

mongoose.Promise = global.Promise;

module.exports = mongoose;