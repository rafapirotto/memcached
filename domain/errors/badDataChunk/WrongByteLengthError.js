const BadDataChunkError = require('./BadDataChunkError');

class WrongByteLengthError extends BadDataChunkError {
  constructor(noreply) {
    super(noreply);
  }
}

module.exports = WrongByteLengthError;
