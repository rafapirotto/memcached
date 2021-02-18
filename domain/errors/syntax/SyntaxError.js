const {
  ERROR_MESSAGE,
} = require('../../constants/messages');

class SyntaxError extends Error {
  constructor() {
    super(ERROR_MESSAGE);
  }
}
module.exports = SyntaxError;
