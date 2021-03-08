const mongoose = require('../../database/');

const TaskSchema = new mongoose.Schema({
  titulo: {
    type: String,
    require: true
  },
  projeto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    require: true
  },
  atribuido: {
    type: String,
    require: true
  },
  concluido: {
    type: Boolean,
    require: true,
    default: false
  },
  criado: {
    type: Date,
    default: Date.now,
  }
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;