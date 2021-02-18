const BadCommandLineError = require('./BadCommandLineError');

class BadCommandLineFormatError extends BadCommandLineError {
  constructor(message) {
    super(message);
  }
}
module.exports = BadCommandLineFormatError;
