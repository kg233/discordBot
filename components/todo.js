//each time command that triggers a todo is called, a todo object is created.
//constructor:
//todos is fetched from the database, an array of todo objects..?
//message is the message that is made by the bot after todo function has been called by the user
//used to editing the message, handling reaction inputs.
const { toggleComplete } = require('../queries/queries');

class Todos {
  constructor(message, pkg) {
    this._id = pkg._id;
    this.message = message;
    this.todos = pkg.todos;
    this.cursor = 0;
    this.pageSize = 6;
    this.left = 0;
    this.right = 0;
    if (this.todos.length >= this.pageSize) {
      this.right = this.pageSize - 1;
    } else {
      this.right = this.todos.length - 1;
    }
    this.todos.sort((a, b) => {
      return a.completed - b.completed;
    });
  }

  start() {
    console.log('_id:', this._id);
    this.message
      .react('⬆️')
      .then(rct => {
        rct.message.react('⬇️').then(rct => {
          rct.message.react('⬅️').then(rct => {
            rct.message.react('➡️').then(rct => {
              rct.message.react('⭕');
            });
          });
        });
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
    this.render();
  }

  makeHeader() {
    if (this.left === 0) {
      return 'todo list\n------------TOP-------------\n';
    }
    return 'todo list\n----------------------------\n';
  }

  render() {
    let str = '';
    for (let i = this.left; i <= this.right; i++) {
      //apparently discord disables markdowns in code blocks lol
      str += '\n';

      if (i == this.cursor) {
        str += `--> `;
      }

      str += `${this.todos[i].description}`;

      str += this.todos[i].completed ? '  ☑️' : '  ❌';
    }

    if (this.right === this.todos.length - 1) {
      str += '\n------------END-------------\n----------------------------';
    } else {
      str += '\n----------------------------\n----------------------------';
    }

    str = this.makeHeader() + str.slice(1);
    this.message.edit(str, {
      code: true,
    });
  }

  handle(emojiUNI) {
    if (emojiUNI === '⬆️') {
      if (this.cursor > 0) {
        this.cursor -= 1;
        if (this.cursor < this.left) {
          this.left -= 1;
          this.right -= 1;
        }
        this.render();
      }
    } else if (emojiUNI === '⬇️') {
      if (this.cursor < this.todos.length - 1) {
        this.cursor += 1;
        if (this.cursor > this.right) {
          this.left += 1;
          this.right += 1;
        }
        this.render();
      }
    } else if (emojiUNI === '⬅️') {
      if (this.left > 0) {
        let oldLeft = this.left;
        this.left = Math.max(this.left - this.pageSize, 0);
        let offset = oldLeft - this.left;

        this.cursor = this.cursor - offset;
        this.right = this.right - offset;
        this.render();
      }
    } else if (emojiUNI === '➡️') {
      if (this.right < this.todos.length - 1) {
        let oldRight = this.right;
        this.right = Math.min(
          this.todos.length - 1,
          this.right + this.pageSize
        );
        let offset = this.right - oldRight;

        this.cursor += offset;
        this.left += offset;
        this.render();
      }
    } else if (emojiUNI === '⭕') {
      let todo = this.todos[this.cursor];
      toggleComplete(this._id, todo._id, todo.completed);
      this.todos[this.cursor].completed = !todo.completed;
      this.todos.sort((a, b) => {
        return a.completed - b.completed;
      });
      this.render();
    }
  }
}

module.exports = Todos;
