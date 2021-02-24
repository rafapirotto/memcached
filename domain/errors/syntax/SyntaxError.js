const { ERROR_MESSAGE } = require('../../constants/messages');
const ClientError = require('../ClientError');

class SyntaxError extends ClientError {
  constructor() {
    super(ERROR_MESSAGE);
  }
}

module.exports = SyntaxError;
