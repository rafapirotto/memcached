const SyntaxError = require('./SyntaxError');

class NoOptionsError extends SyntaxError {
  constructor() {
    super();
  }
}

module.exports = NoOptionsError;
