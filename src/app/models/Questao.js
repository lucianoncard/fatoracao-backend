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
  return `${process.env.APP_URL}/files/${this.thumbnail}`
})

module.exports = mongoose.model('Questao', SpotSchema);