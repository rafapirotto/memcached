const SyntaxError = require('./SyntaxError');

class WrongArgumentNumberError extends SyntaxError { }

module.exports = WrongArgumentNumberError;
