const mongoose = require('mongoose');

const SpotSchema = new mongoose.Schema({
  thumbnail: String,
  vestibular: String,
  ano: String,
  questao: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'    
  }
}, {
  toJSON: {
    virtuals: true,  
  },
});

SpotSchema.virtual('thumbnail_url').get(function(){
  return `http://fatoracao-backend.herokuapp.com/files/${this.thumbnail}`
})

module.exports = mongoose.model('Questao', SpotSchema);