const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Project = require('../models/Project');
const Task = require('../models/Task');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate(['usuario', 'tarefas']);
    return res.send({ projects });
  } catch (err) {
    return res.status(400).send({ error: "Erro no carregamento dos projetos!" });
  }
});

router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate(['usuario', 'tarefas']);
    return res.send({ project });
  } catch (err) {
    return res.status(400).send({ error: "Erro no carregamento do projeto!" });
  }
});

router.post('/', async (req, res) => {
  try {
    const { titulo, descricao, tarefas } = req.body;
    const project = await Project.create({ titulo, descricao, usuario: req.userId });
    await Promise.all(tarefas.map(async tarefa => {
      const projectTask = new Task({ ...tarefa, projeto: project._id });
      await projectTask.save();
      project.tarefas.push(projectTask);
    }));
    await project.save();
    return res.send({ project });
  } catch (err) {
    return res.status(400).send({ error: "Erro na criação de um novo projeto!" });
  }
});

router.put('/:projectId', async (req, res) => {
  try {
    const { titulo, descricao, tarefas } = req.body;
    const project = await Project.findByIdAndUpdate(req.params.projectId, {
      titulo,
      descricao
    }, { new: true });
    project.tarefas = [];
    await Task.deleteMany({ projeto: project._id });
    await Promise.all(tarefas.map(async tarefa => {
      const projectTask = new Task({ ...tarefa, projeto: project._id });
      await projectTask.save();
      project.tarefas.push(projectTask);
    }));
    await project.save();
    return res.send({ project });
  } catch (err) {
    return res.status(400).send({ error: "Erro na atualização do projeto!" });
  }
});

router.delete('/:projectId', async (req, res) => {
  try {
    await Project.findByIdAndRemove(req.params.projectId);
    return res.send();
  } catch (err) {
    return res.status(400).send({ error: "Erro ao deletar projeto!" });
  }
});

module.exports = app => app.use('/projects', router);