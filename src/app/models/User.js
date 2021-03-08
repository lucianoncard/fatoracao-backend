const mongoose = require('../../database/');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    require: true
  },
  email: {
    type: String,
    unique: true,
    require: true,
    lowercase: true
  },
  celular: {
    type: String,
    require: true
  },
  cidade: {
    type: String,
    require: true
  },
  estado: {
    type: String,
    require: true
  },
  senha: {
    type: String,
    require: true,
    select: false
  },
  tokenResetSenha: {
    type: String,
    select: false
  },
  expiracaoResetSenha: {
    type: Date,
    select: false
  },
  criado: {
    type: Date,
    default: Date.now,
  }
});

UserSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.senha, 10);
  this.senha = hash;
  next(); 
});

const User = mongoose.model('User', UserSchema);

module.exports = User;