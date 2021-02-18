const {
  BAD_DATA_CHUNK,
} = require('../../constants/messages');

class BadDataChunkError extends Error {
  constructor() {
    super(BAD_DATA_CHUNK);
  }
}
module.exports = BadDataChunkError;
