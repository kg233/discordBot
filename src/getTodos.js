//returns a Todo class object that relates the author id, and binds the message to the object.
const Todos = require('../components/todo');
const { queryTodos } = require('../queries/queries');

function getTodos(author_id, message) {
  //get request to database on author_id
  return queryTodos(author_id)
    .then(pkg => {
      if (!pkg || !pkg.todos) {
        return null;
      }
      return new Todos(message, pkg);
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
}

module.exports = getTodos;
