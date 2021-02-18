const BadDataChunkError = require('./BadDataChunkError');

class DataExpectedError extends BadDataChunkError {
  constructor() {
    super();
  }
}
module.exports = DataExpectedError;
