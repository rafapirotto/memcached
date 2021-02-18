const SyntaxError = require('./SyntaxError');

class WrongArgumentNumberError extends SyntaxError {
  constructor(message) {
    super(message);
  }
}
module.exports = WrongArgumentNumberError;
