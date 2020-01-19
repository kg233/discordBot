const Image = require('../models/image');
const User = require('../models/user.js');

async function getImageUrl() {
  let v = await Image.find();
  v = v.map(image => {
    return image.url;
  });
  return v;
}

async function queryTodos(author_id) {
  let v = await User.findOne({ user_id: author_id });
  if (v == null) {
    return null;
  }
  return { _id: v._id, todos: v.todos };
}

//mutation

async function addTodos(author_id, description) {
  let user = await User.findOne({ user_id: author_id });
  console.log('returned', user);
  if (user == null) {
    user = new User({
      user_id: author_id,
      todos: [{ description: description, completed: false }],
    });
    user.save().then(record => {
      console.log(record);
    });
  } else {
    user.todos.push({ description: description, completed: false });
    user.save().then(rec => {
      console.log(rec);
    });
  }
}

//sets the todo to !isComplete
async function toggleComplete(userId, todoId, isComplete) {
  User.updateOne(
    { _id: userId, 'todos._id': todoId },
    { $set: { 'todos.$.completed': !isComplete } },
    (err, raw) => {
      console.log(raw);
    }
  );
}

module.exports = { getImageUrl, queryTodos, addTodos, toggleComplete };
