const {
  BAD_DATA_CHUNK, ERROR_MESSAGE,
} = require('../../constants/messages');

class BadDataChunkError extends Error {
  constructor(noreply) {
    if (noreply === 'noreply') super(ERROR_MESSAGE);
    else super(BAD_DATA_CHUNK);
  }
}
module.exports = BadDataChunkError;
