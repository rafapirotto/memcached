class BadDataChunkError extends Error {
  constructor(message) {
    super(message);
  }
}
module.exports = BadDataChunkError;
