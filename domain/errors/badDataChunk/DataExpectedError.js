const BadDataChunkError = require('./BadDataChunkError');

class DataExpectedError extends BadDataChunkError {
  constructor(message) {
    super(message);
  }
}
module.exports = DataExpectedError;
