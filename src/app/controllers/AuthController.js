const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');
const authConfig = require('../../config/auth');
const User = require('../models/User');

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret);
}

router.post('/register', async (req, res) => {
  const { email } = req.body;
  try{
    if(await User.findOne({ email }))
      return res.status(400).send({ error: "Usuário existente!" });
    const user = await User.create(req.body);
    user.senha = undefined;
    return res.send({
      user,
      token: generateToken ({ id: user.id })
    });
  } catch (err) {
    return res.status(400).send({ error: "Falha de login!" });
  }
});

router.post('/authenticate', async (req, res) => {
  const { email, senha } = req.body;
  const user  = await User.findOne({ email }).select('+senha');
  if (!user) {
    return res.status(400).send({ error: "Usuário não identificado!"});
  }
  if (!await bcrypt.compare(senha, user.senha)){
    return res.status(400).send({ error: "Senha inválida!"});
  }
  user.senha = undefined;  
  res.send ({
    user,
    token: generateToken({ id: user.id })
  });
});

router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).send({ error: "Usuário não identificado!" });
    
    const token = crypto.randomBytes(10).toString('hex');
    const now = new Date();
    now.setHours(now.getHours() + 1);
    await User.findByIdAndUpdate(user.id, {
      '$set': {
        tokenResetSenha: token,
        expiracaoResetSenha: now
      }
    });
    mailer.sendMail({
      to: email,
      from: 'contato@fatoracao.mat.br',
      template: 'auth/forgot_password',
      context:  { token }
    }, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).send({ error: "Falha de envio de email de recuperação de senha!" });
      }
      return res.send();
    });
  } catch (err) {
    return res.status(400).send({ error: "Falha na recuperação de senha!" });
  }
});

router.post('/reset_password', async (req, res) => {
  const { email, token, senha } = req.body;

  try {
    const user = await User.findOne({ email })
      .select('+tokenResetSenha expiracaoResetSenha');
    if (!user) {
      return res.status(400).send({ error: "Usuário não identificado!"});
    }
    if (token !== user.tokenResetSenha)
      return res.status(400).send({ error: "Token inválido!"});
    const now = new Date();
    if (now > user.expiracaoResetSenha)
      return res.status(400).send({ error: "Token expirado!"});
    user.senha = senha;
    await user.save();
    res.send();
  } catch (err) {
    return res.status(400).send({ error: "Falha ao resetar senha!" });
  }
});

router.put('/save/', async (req, res) => {
  try {
    const { nome, email, celular, cidade, estado, aluno_id } = req.body;
    const user = await User.findByIdAndUpdate(aluno_id, {
      nome, email, celular, cidade, estado
    }, { new: true });
    return res.send({ user });
  } catch (err) {
    return res.status(400).send({ error: "Erro na atualização do cadastro!" });
  }
});

router.get('/alunos', async (req, res) => {
  const alunos = await User.find({});
  return res.json(alunos);
});

router.delete('/alunos', async (req, res) => {
  const { aluno_id } = req.headers;
  await User.findByIdAndRemove(aluno_id);
  return res.status(204).send();
});

module.exports = app => app.use('/auth', router);