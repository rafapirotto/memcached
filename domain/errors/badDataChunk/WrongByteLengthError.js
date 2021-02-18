const BadDataChunkError = require('./BadDataChunkError');

class WrongByteLengthError extends BadDataChunkError {
  constructor() {
    super();
  }
}
module.exports = WrongByteLengthError;
