const SyntaxError = require('./SyntaxError');

class WrongArgumentNumberError extends SyntaxError {
  constructor() {
    super();
  }
}

module.exports = WrongArgumentNumberError;
