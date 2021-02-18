const BadDataChunkError = require('./BadDataChunkError');

class WrongByteLengthError extends BadDataChunkError {
  constructor(message) {
    super(message);
  }
}
module.exports = WrongByteLengthError;
