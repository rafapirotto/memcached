const BadCommandLineError = require('./BadCommandLineError');

class BadCommandLineFormatError extends BadCommandLineError {
  constructor() {
    super();
  }
}
module.exports = BadCommandLineFormatError;
