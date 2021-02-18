const SyntaxError = require('./SyntaxError');

class InvalidCommandError extends SyntaxError {
  constructor(message) {
    super(message);
  }
}
module.exports = InvalidCommandError;
