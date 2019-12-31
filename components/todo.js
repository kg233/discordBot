//each time command that triggers a todo is called, a todo object is created.
//constructor:
//todos is fetched from the database, an array of todo objects..?
//message is the message that is made by the bot after todo function has been called by the user
//used to editing the message, handling reaction inputs.

class Todos {
  constructor(message, todos) {
    this.message = message;
    this.todos = todos;
    this.cursor = 0;
    this.pagesize = 6;
    this.left = 0;
    this.right = 0;
    if (this.todos.length >= 6) {
      this.right = 5;
    } else {
      this.right = this.todos.length - 1;
    }
  }

  makeHeader() {
    return 'todo list\n----------------------------\n';
  }

  render() {
    this.message.edit(`${this.makeHeader()}this is render`, {
      code: true,
    });
  }

  handle(emojiUNI) {
    this.message.edit(`${this.makeHeader()}${emojiUNI}`, { code: true });
  }
}

module.exports = Todos;
