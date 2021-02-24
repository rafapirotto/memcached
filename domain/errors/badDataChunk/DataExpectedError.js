const BadDataChunkError = require('./BadDataChunkError');

class DataExpectedError extends BadDataChunkError {
  constructor(noreply) {
    super(noreply);
  }
}

module.exports = DataExpectedError;
