const SyntaxError = require('./SyntaxError');

class InvalidCommandError extends SyntaxError {
  constructor() {
    super();
  }
}
module.exports = InvalidCommandError;
