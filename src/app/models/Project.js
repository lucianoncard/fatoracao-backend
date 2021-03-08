const mongoose = require('../../database/');

const ProjectSchema = new mongoose.Schema({
  titulo: {
    type: String,
    require: true
  },
  descricao: {
    type: String,
    require: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  tarefas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  criado: {
    type: Date,
    default: Date.now,
  }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;