const { BAD_DATA_CHUNK, ERROR_MESSAGE } = require('../../constants/messages');
const ClientError = require('../ClientError');

class BadDataChunkError extends ClientError {
  constructor(noreply) {
    if (noreply === 'noreply') super(ERROR_MESSAGE);
    else super(BAD_DATA_CHUNK);
  }
}

module.exports = BadDataChunkError;
