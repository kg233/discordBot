//returns a Todo class object that relates the author id, and binds the message to the object.
const Todos = require('../components/todo');
const { queryTodos } = require('../queries/queries');

const testTodos = [
  { id: 1, description: 'do dishes', finished: false },
  { id: 1, description: "fuck vb's ass", finished: false },
  { id: 1, description: "fuck vb's ass again", finished: false },
  { id: 1, description: "fuck vb's ass again2", finished: false },
  { id: 1, description: "fuck vb's ass again3", finished: false },
  { id: 1, description: "fuck vb's ass 4", finished: false },
  { id: 1, description: "fuck vb's ass 5", finished: false },
  { id: 1, description: "fuck vb's ass 6", finished: false },
  { id: 1, description: "fuck vb's ass 7", finished: false },
  { id: 1, description: "fuck vb's ass 8", finished: false },
  { id: 1, description: "fuck vb's ass 9", finished: false },
  { id: 1, description: "fuck vb's ass 10", finished: false },
  { id: 1, description: 'do homework', finished: false },
  { id: 1, description: 'play neko para', finished: false },
  { id: 1, description: 'hit airplane', finished: false },
];

function getTodos(author_id, message) {
  //get request to database on author_id
  return queryTodos(author_id)
    .then(todos => {
      console.log(todos);
      let temp = new Todos(message, todos);
      return temp;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
}

module.exports = getTodos;
