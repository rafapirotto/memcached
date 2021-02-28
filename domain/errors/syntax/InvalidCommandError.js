const SyntaxError = require('./SyntaxError');

class InvalidCommandError extends SyntaxError { }

module.exports = InvalidCommandError;
