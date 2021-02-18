const SyntaxError = require('./SyntaxError');

class NoOptionsError extends SyntaxError {
  constructor(message) {
    super(message);
  }
}
module.exports = NoOptionsError;
