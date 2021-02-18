const {
  BAD_COMMAND_LINE_FORMAT,
} = require('../../constants/messages');

class BadCommandLineError extends Error {
  constructor() {
    super(BAD_COMMAND_LINE_FORMAT);
  }
}
module.exports = BadCommandLineError;
