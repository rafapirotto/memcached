const {
  BAD_COMMAND_LINE_FORMAT,
} = require('../../constants/messages');
const ClientError = require('../ClientError');

class BadCommandLineError extends ClientError {
  constructor() {
    super(BAD_COMMAND_LINE_FORMAT);
  }
}
module.exports = BadCommandLineError;
