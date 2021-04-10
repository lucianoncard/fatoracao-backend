const express = require('express');
const multer = require('multer');
const uploadConfig = require('../../config/upload');

const User = require('../models/User');
const Questao = require('../models/Questao');

const router = express.Router();
const upload = multer(uploadConfig);

router.get('/', async (req, res) => {
  const { palavra } = req.headers;
  var spots = 'Selecione';
  if ( palavra != 'Selecione') { spots = await Questao.find({ vestibular: palavra }); }
  else { spots = await Questao.find(); }
  return res.json(spots);
});

router.post('/', upload.single('thumbnail'), async (req, res) => {
  const { filename } = req.file;
  const { vestibular, ano, questao } = req.body;
  const { aluno_id } = req.headers;
  const user = await User.findById(aluno_id);
  if (!user){
    return res.status(400).json({ error: 'Usuário não existe!' });
  }
  const spot = await Questao.create({
    user: aluno_id,
    thumbnail: filename,
    vestibular,
    ano,
    questao
  });
  return res.json(spot);
});

router.delete('/', async (req, res) => {
  var { user, questao, aluno_id } = req.headers;
  if (aluno_id === user) await Questao.findByIdAndRemove(questao);
  else return res.status(401).json({ error: 'Não permitido!' });
  return res.status(204).send();
});


module.exports = app => app.use('/questoes', router);