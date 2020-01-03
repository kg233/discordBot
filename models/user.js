const mongoose = require('mongoose');

const Todo = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    require: true,
  },
});

const User = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  todos: [Todo],
});

module.exports = mongoose.model('user', User);
