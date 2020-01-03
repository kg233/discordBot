//returns a Todo class object that relates the author id, and binds the message to the object.
const Todos = require('../components/todo');
const { queryTodos } = require('../queries/queries');

function getTodos(author_id, message) {
  //get request to database on author_id
  return queryTodos(author_id)
    .then(todos => {
      if (todos === null) {
        return null;
      }
      let temp = new Todos(message, todos);
      return temp;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
}

module.exports = getTodos;
